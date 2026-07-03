import { useState, useEffect, useCallback, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { api, saveSession } from "../../services/api";
import OTPInput from "../../components/auth/OTPInput";

const OTPVerification = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Get signup data from navigation state
  const signupData = location.state?.signupData;
  const email = signupData?.email || location.state?.email || "";

  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Timer states
  const [timeLeft, setTimeLeft] = useState(300); // 5 minutes in seconds
  const [resendCooldown, setResendCooldown] = useState(0);
  const [isExpired, setIsExpired] = useState(false);

  // Attempt tracking
  const [remainingAttempts, setRemainingAttempts] = useState(5);

  // Dev mode OTP display
  const [devOTP, setDevOTP] = useState("");

  // Ref to track if auto-submit is pending
  const autoSubmitInProgress = useRef(false);

  // Redirect if no email
  useEffect(() => {
    if (!email) {
      navigate("/signup", { replace: true });
    }
  }, [email, navigate]);

  // Countdown timer for OTP expiry
  useEffect(() => {
    if (timeLeft <= 0 || isExpired) {
      if (!isExpired) {
        setIsExpired(true);
        setError("OTP has expired. Please request a new one.");
      }
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, isExpired]);

  // Resend cooldown timer
  useEffect(() => {
    if (resendCooldown <= 0) return;

    const timer = setInterval(() => {
      setResendCooldown((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [resendCooldown]);

  // Format seconds to MM:SS
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  // Handle OTP completion from input - auto-submit when all 6 digits entered
  const handleOTPComplete = useCallback((otpValue) => {
    setOtp(otpValue);
    setError("");

    // Auto-submit the OTP after a brief delay to ensure state is updated
    if (otpValue && otpValue.length === 6) {
      // Clear any previous auto-submit
      autoSubmitInProgress.current = false;
      
      // Small delay to let state settle, then verify
      setTimeout(() => {
        if (!autoSubmitInProgress.current) {
          autoSubmitInProgress.current = true;
          // We need to trigger verification; use a synthetic event or call directly
          handleVerifyOTP(null, otpValue);
        }
      }, 150);
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Verify OTP
  const handleVerifyOTP = async (e, directOTP) => {
    if (e?.preventDefault) e.preventDefault();

    const otpToVerify = directOTP || otp;

    if (!otpToVerify || otpToVerify.length < 6) {
      return setError("Please enter the complete 6-digit OTP.");
    }

    setLoading(true);
    setError("");

    try {
      const data = await api("/auth/verify-otp", {
        method: "POST",
        body: { email, otp: otpToVerify }
      });

      setSuccess(data.message);

      // Save session with JWT token
      if (data.token && data.user) {
        saveSession(data);
      }

      // Redirect to profile after short delay
      setTimeout(() => {
        if (data.user?.role === "business_owner") {
          navigate("/vendor/dashboard");
        } else {
          navigate("/profile");
        }
      }, 2000);
    } catch (err) {
      setError(err.message);

      // Update remaining attempts from error response
      if (err.remainingAttempts !== undefined) {
        setRemainingAttempts(err.remainingAttempts);
      }

      // If OTP expired, update state
      if (err.message?.toLowerCase().includes("expired")) {
        setIsExpired(true);
      }

      // Reset OTP on invalid attempt to let user re-enter
      setOtp("");
      autoSubmitInProgress.current = false;
    } finally {
      setLoading(false);
    }
  };

  // Resend OTP
  const handleResendOTP = async () => {
    if (resendCooldown > 0) return;

    setLoading(true);
    setError("");

    try {
      const data = await api("/auth/resend-otp", {
        method: "POST",
        body: { email }
      });

      // Reset timer and state
      setTimeLeft(300);
      setIsExpired(false);
      setOtp("");
      setRemainingAttempts(5);
      setResendCooldown(30);
      setError("");
      autoSubmitInProgress.current = false;

      // Show dev OTP if in demo mode
      if (data.devOTP) {
        setDevOTP(data.devOTP);
      }

      setSuccess("New OTP sent to your email!");
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Cancel registration
  const handleCancel = async () => {
    try {
      await api("/auth/cancel-verification", {
        method: "POST",
        body: { email }
      });
    } catch {
      // Ignore cancel errors
    }
    navigate("/signup", { replace: true });
  };

  // Check OTP status on mount
  useEffect(() => {
    const checkStatus = async () => {
      if (!email) return;
      try {
        const data = await api(`/auth/otp-status?email=${encodeURIComponent(email)}`);
        if (data.status === "verified") {
          setSuccess("This email is already verified!");
          setTimeout(() => navigate("/profile"), 1500);
        } else if (data.status === "not_found") {
          setError("No pending verification found. Please sign up again.");
        } else if (data.status === "expired") {
          setIsExpired(true);
          setError("OTP has expired. Please request a new one.");
        } else {
          if (data.remainingAttempts >= 0) {
            setRemainingAttempts(data.remainingAttempts);
          }
          if (data.cooldownRemaining > 0) {
            setResendCooldown(data.cooldownRemaining);
          }
        }
      } catch {
        // Status check is non-critical
      }
    };
    checkStatus();
  }, [email, navigate]);

  // Check for dev OTP in signupData
  useEffect(() => {
    if (signupData?.devOTP) {
      setDevOTP(signupData.devOTP);
    }
  }, [signupData]);

  if (!email) return null;

  const isTimerWarning = timeLeft <= 60;

  return (
    <main className="min-h-screen bg-[#F9FAFB] px-4 py-8 md:px-6 md:py-10">
      <section className="mx-auto max-w-xl rounded-3xl border border-[#E5E7EB] bg-white p-6 shadow-sm md:p-10">
        {/* Header */}
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-50 mb-4">
            <svg className="w-8 h-8 text-[#22C55E]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </div>

          <span className="rounded-full bg-green-50 px-4 py-2 text-sm font-semibold text-[#22C55E]">
            Email Verification
          </span>

          <h1 className="mt-4 text-2xl font-bold text-[#1F2937] md:text-3xl">
            Verify Your Email
          </h1>

          <p className="mt-3 text-sm text-[#6B7280]">
            We've sent a 6-digit verification code to
          </p>
          <p className="mt-1 font-semibold text-[#1F2937]">{email}</p>
        </div>

        {/* OTP Input Section */}
        <form onSubmit={(e) => handleVerifyOTP(e)} className="mt-8 space-y-6">
          {/* Timer Bar */}
          <div className="mb-2">
            <div className="flex items-center justify-between text-sm">
              <span className={`font-medium ${isTimerWarning ? "text-red-600" : "text-[#6B7280]"}`}>
                {isExpired ? "Expired" : `Valid for ${formatTime(timeLeft)}`}
              </span>
              <span className="text-[#6B7280]">
                {remainingAttempts} attempt{remainingAttempts !== 1 ? "s" : ""} remaining
              </span>
            </div>
            {/* Progress bar */}
            <div className="mt-2 h-1.5 w-full rounded-full bg-gray-200">
              <div
                className={`h-1.5 rounded-full transition-all duration-1000 ${
                  isTimerWarning ? "bg-red-500" : "bg-[#22C55E]"
                }`}
                style={{ width: `${(timeLeft / 300) * 100}%` }}
              />
            </div>
          </div>

          {/* OTP Input */}
          <div className="py-4">
            <OTPInput
              length={6}
              onComplete={handleOTPComplete}
              disabled={loading || isExpired}
              error={!!error && !success}
            />
          </div>

          {/* Dev Mode OTP display */}
          {devOTP && (
            <div className="rounded-lg border border-yellow-200 bg-yellow-50 p-3 text-center">
              <p className="text-xs font-medium text-yellow-700">🔧 Development Mode</p>
              <p className="mt-1 text-lg font-bold tracking-wider text-yellow-800">
                OTP: {devOTP}
              </p>
              <p className="text-xs text-yellow-600">This OTP is shown only in development mode</p>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="rounded-lg border border-red-200 bg-red-50 p-3">
              <p className="text-center text-sm font-medium text-red-600">{error}</p>
            </div>
          )}

          {/* Success Message */}
          {success && (
            <div className="rounded-lg border border-green-200 bg-green-50 p-3">
              <p className="text-center text-sm font-medium text-green-600">{success}</p>
            </div>
          )}

          {/* Verify Button - stays for manual click but auto-submit handles it */}
          <button
            type="submit"
            disabled={loading || otp.length < 6 || isExpired}
            className="w-full rounded-lg bg-[#22C55E] px-4 py-3 text-sm font-semibold text-white transition-all hover:bg-green-600 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Verifying...
              </span>
            ) : (
              "Verify Email"
            )}
          </button>

          {/* Resend & Cancel Links */}
          <div className="space-y-3 text-center">
            <div>
              {isExpired ? (
                <button
                  type="button"
                  onClick={handleResendOTP}
                  disabled={loading}
                  className="font-semibold text-[#22C55E] hover:text-green-700 disabled:opacity-50"
                >
                  Request New OTP
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleResendOTP}
                  disabled={resendCooldown > 0 || loading || isExpired}
                  className="text-sm text-[#6B7280] hover:text-[#1F2937] disabled:opacity-50"
                >
                  {resendCooldown > 0 ? (
                    `Resend OTP in ${resendCooldown}s`
                  ) : (
                    <span className="font-semibold text-[#22C55E] hover:text-green-700">
                      Resend OTP
                    </span>
                  )}
                </button>
              )}
            </div>

            <div className="pt-2">
              <button
                type="button"
                onClick={handleCancel}
                className="text-sm text-[#9CA3AF] hover:text-red-500 transition-colors"
              >
                Cancel & Go Back
              </button>
            </div>
          </div>
        </form>

        {/* Help Text */}
        <div className="mt-8 rounded-xl border border-[#E5E7EB] bg-[#F9FAFB] p-4">
          <h3 className="text-sm font-semibold text-[#1F2937]">💡 Need Help?</h3>
          <ul className="mt-2 space-y-1.5 text-xs text-[#6B7280]">
            <li>• Check your spam/junk folder if you don't see the email</li>
            <li>• The OTP is valid for 5 minutes only</li>
            <li>• You have 5 attempts to enter the correct OTP</li>
            <li>• Make sure your email address is correct</li>
          </ul>
        </div>
      </section>
    </main>
  );
};

export default OTPVerification;