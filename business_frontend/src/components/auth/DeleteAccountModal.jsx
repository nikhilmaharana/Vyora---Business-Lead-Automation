import { useState } from "react";
import { api } from "../../services/api";

const DeleteAccountModal = ({ isOpen, onClose, onDeleted }) => {
  const [confirmation, setConfirmation] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [step, setStep] = useState("confirm"); // 'confirm' or 'type'

  const handleClose = () => {
    if (loading) return; // Don't close while deleting
    setConfirmation("");
    setError("");
    setStep("confirm");
    onClose();
  };

  const handleProceedToType = () => {
    setStep("type");
    setError("");
  };

  const handleDelete = async (event) => {
    event?.preventDefault();

    const trimmedConfirmation = confirmation.trim();
    console.log("[DeleteAccountModal] Delete requested", {
      confirmationMatches: trimmedConfirmation === "DELETE MY ACCOUNT",
      confirmationLength: trimmedConfirmation.length,
    });

    if (trimmedConfirmation !== "DELETE MY ACCOUNT") {
      setError('Please type exactly "DELETE MY ACCOUNT" to confirm.');
      return;
    }

    setLoading(true);
    setError("");

    try {
      console.log("[DeleteAccountModal] Sending delete-account API request");
      const data = await api("/auth/delete-account", {
        method: "DELETE",
        body: { confirmation: trimmedConfirmation }
      });
      console.log("[DeleteAccountModal] Delete-account API succeeded", data);

      // Clear all local session data
      localStorage.removeItem("vyora_session");
      sessionStorage.clear();

      // Notify parent that deletion succeeded
      onDeleted(data.message);
      
      // Close modal
      onClose();

      // Redirect to home page after a brief moment
      setTimeout(() => {
        window.location.href = "/";
      }, 1500);
    } catch (err) {
      console.error("[DeleteAccountModal] Delete-account API failed", {
        message: err.message,
        status: err.status,
        response: err.response,
        rawResponse: err.rawResponse,
        error: err,
      });
      setError(err.message || "Failed to delete account. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="relative w-full max-w-md rounded-2xl bg-white shadow-2xl p-6 md:p-8">
        {/* Close button */}
        <button
          onClick={handleClose}
          disabled={loading}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 disabled:opacity-50"
          aria-label="Close"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Step 1: Warning Confirmation */}
        {step === "confirm" && (
          <>
            <div className="text-center mb-6">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-50 mb-4">
                <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-[#1F2937]">Delete Account</h2>
              <p className="mt-2 text-sm text-[#6B7280]">
                This action is <strong className="text-red-500">permanent</strong> and cannot be undone.
              </p>
            </div>

            <div className="space-y-4">
              <div className="rounded-xl border border-red-200 bg-red-50 p-4">
                <ul className="space-y-2 text-sm text-red-700">
                  <li className="flex items-start gap-2">
                    <span>•</span>
                    <span>Your profile and personal information will be permanently deleted</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span>•</span>
                    <span>All your saved favorites and activity history will be removed</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span>•</span>
                    <span>If you are a vendor, your business listings and products will be deleted</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span>•</span>
                    <span>This action cannot be reversed — you will lose access to all data</span>
                  </li>
                </ul>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={handleClose}
                  className="flex-1 rounded-lg border border-[#E5E7EB] px-4 py-3 text-sm font-semibold text-[#1F2937] hover:bg-gray-50 transition"
                >
                  Cancel
                </button>
                <button
                  onClick={handleProceedToType}
                  className="flex-1 rounded-lg bg-red-500 px-4 py-3 text-sm font-semibold text-white hover:bg-red-600 transition"
                >
                  I Understand
                </button>
              </div>
            </div>
          </>
        )}

        {/* Step 2: Type Confirmation Phrase */}
        {step === "type" && (
          <>
            <div className="text-center mb-6">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-50 mb-4">
                <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <h2 className="text-xl font-bold text-[#1F2937]">Final Confirmation</h2>
              <p className="mt-2 text-sm text-[#6B7280]">
                Type <strong className="text-red-500">DELETE MY ACCOUNT</strong> below to confirm permanent deletion.
              </p>
            </div>

            <form onSubmit={handleDelete} className="space-y-4">
              <div>
                <label className="mb-2 block text-sm font-semibold text-[#1F2937]">
                  Confirmation Phrase
                </label>
                <input
                  type="text"
                  value={confirmation}
                  onChange={(e) => {
                    setConfirmation(e.target.value);
                    setError("");
                  }}
                  placeholder="Type DELETE MY ACCOUNT"
                  className={`w-full rounded-lg border px-4 py-3 text-sm text-[#1F2937] outline-none transition ${
                    error
                      ? "border-red-400 bg-red-50 focus:border-red-500 focus:ring-2 focus:ring-red-100"
                      : "border-[#E5E7EB] bg-[#F9FAFB] focus:border-red-400 focus:ring-2 focus:ring-red-100"
                  }`}
                  disabled={loading}
                  autoFocus
                />
                {error && (
                  <p className="mt-2 text-sm text-red-600">{error}</p>
                )}
              </div>

              <div className="rounded-lg bg-gray-50 p-3 border border-[#E5E7EB]">
                <p className="text-xs text-[#6B7280]">
                  <strong>⚠️ Warning:</strong> This will permanently delete your account and all associated data. This action cannot be undone.
                </p>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={handleClose}
                  disabled={loading}
                  className="flex-1 rounded-lg border border-[#E5E7EB] px-4 py-3 text-sm font-semibold text-[#1F2937] hover:bg-gray-50 transition disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading || confirmation.trim() !== "DELETE MY ACCOUNT"}
                  className="flex-1 rounded-lg bg-red-500 px-4 py-3 text-sm font-semibold text-white hover:bg-red-600 transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <span className="flex items-center justify-center gap-2">
                      <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      Deleting...
                    </span>
                  ) : (
                    "Permanently Delete My Account"
                  )}
                </button>
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  );
};

export default DeleteAccountModal;
