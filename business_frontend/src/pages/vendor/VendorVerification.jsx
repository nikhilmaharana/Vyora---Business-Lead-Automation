import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { api, getUser, isAuthenticated } from "../../services/api";
import {
  Shield, CheckCircle, XCircle, Clock, AlertCircle,
  FileText, Building2, Mail, Phone, MapPin, ChevronRight,
  RefreshCw, Upload, Loader2, ArrowLeft, Info, Eye,
  User, Calendar, Search, Filter
} from "lucide-react";

const VERIFICATION_STEPS = [
  { id: 1, label: "Registration Submitted", description: "Your application has been received" },
  { id: 2, label: "Documents Review", description: "Admin is reviewing your KYC documents" },
  { id: 3, label: "Business Verification", description: "Business details are being verified" },
  { id: 4, label: "Approval Decision", description: "Final approval by admin team" }
];

const VendorVerification = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [verification, setVerification] = useState(null);
  const [business, setBusiness] = useState(null);
  const [vendorStatus, setVendorStatus] = useState(null);
  const [error, setError] = useState("");
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    if (!isAuthenticated()) {
      navigate("/login", { state: { from: "/vendor/verification" } });
      return;
    }
    fetchVerificationData();
  }, []);

  const fetchVerificationData = async () => {
    setLoading(true);
    try {
      // Fetch vendor status
      const statusData = await api("/vendor/status");
      setVendorStatus(statusData);

      // Fetch verification status
      const verData = await api("/vendor/verification/status");
      setVerification(verData.verification || null);

      // Fetch business info
      const bizData = await api("/vendor/business");
      setBusiness(bizData.business || null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleReapply = async () => {
    try {
      await api("/vendor/registration/submit", {
        method: "POST",
        body: { reapply: true }
      });
      fetchVerificationData();
    } catch (err) {
      setError(err.message);
    }
  };

  const getCurrentStep = () => {
    if (!verification) return 0;
    if (verification.kycStatus === 'verified') return 4;
    if (verification.kycStatus === 'under_review') return 3;
    if (verification.kycStatus === 'submitted') return 2;
    if (verification.registrationComplete) return 1;
    return 0;
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'verified':
      case 'approved':
        return { bg: "bg-green-50 border-green-200", text: "text-green-700", icon: CheckCircle, iconColor: "text-green-500" };
      case 'rejected':
        return { bg: "bg-red-50 border-red-200", text: "text-red-700", icon: XCircle, iconColor: "text-red-500" };
      case 'under_review':
      case 'submitted':
        return { bg: "bg-blue-50 border-blue-200", text: "text-blue-700", icon: Clock, iconColor: "text-blue-500" };
      default:
        return { bg: "bg-amber-50 border-amber-200", text: "text-amber-700", icon: Clock, iconColor: "text-amber-500" };
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50/30 flex items-center justify-center">
        <div className="text-center">
          <div className="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-blue-500 border-t-transparent" />
          <p className="mt-4 text-gray-500 font-medium">Loading verification status...</p>
        </div>
      </div>
    );
  }

  const statusStyle = getStatusColor(verification?.kycStatus || vendorStatus?.vendorStatus);
  const StatusIcon = statusStyle.icon;
  const currentStep = getCurrentStep();

  // If user is not a vendor yet, show register prompt
  if (vendorStatus && vendorStatus.role !== 'business_owner') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50/30 flex items-center justify-center px-6">
        <div className="max-w-md w-full text-center">
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-8">
            <div className="w-16 h-16 rounded-2xl bg-blue-50 flex items-center justify-center mx-auto mb-4">
              <Building2 className="text-blue-500" size={32} />
            </div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">Not a Vendor Yet</h2>
            <p className="text-sm text-gray-500 mb-6">
              You need to register as a vendor first to access this page.
            </p>
            <Link
              to="/vendor/register"
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-xl font-medium hover:from-blue-600 hover:to-indigo-700 transition"
            >
              Register as Vendor <ChevronRight size={18} />
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50/30">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate("/vendor/dashboard")}
              className="p-2 hover:bg-gray-100 rounded-xl transition"
            >
              <ArrowLeft size={20} className="text-gray-500" />
            </button>
            <div>
              <h1 className="text-xl font-bold text-gray-900">Verification Status</h1>
              <p className="text-sm text-gray-500">Track your vendor account approval progress</p>
            </div>
          </div>
          <button
            onClick={fetchVerificationData}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-600 bg-white border border-gray-300 rounded-xl hover:bg-gray-50 transition"
          >
            <RefreshCw size={16} />
            Refresh
          </button>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-8">
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-sm text-red-700 flex items-center gap-2">
            <AlertCircle size={16} />
            {error}
          </div>
        )}

        {/* Status Banner */}
        <div className={`mb-8 rounded-2xl border p-6 ${statusStyle.bg}`}>
          <div className="flex items-start gap-4">
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${statusStyle.iconColor} bg-white/80`}>
              <StatusIcon size={28} />
            </div>
            <div className="flex-1">
              <h2 className={`text-lg font-bold ${statusStyle.text}`}>
                {verification?.kycStatus === 'verified' && 'Account Verified ✓'}
                {verification?.kycStatus === 'rejected' && 'Registration Rejected'}
                {verification?.kycStatus === 'under_review' && 'Under Review'}
                {verification?.kycStatus === 'submitted' && 'Documents Submitted'}
                {(!verification || verification?.kycStatus === 'pending') && 'Registration Pending'}
              </h2>
              <p className={`mt-1 text-sm ${statusStyle.text} opacity-80`}>
                {verification?.kycStatus === 'verified' && 'Your vendor account is fully verified and approved! You can now add products and receive leads.'}
                {verification?.kycStatus === 'rejected' && (verification.rejectionReason || 'Your registration was not approved. Please review the feedback and re-submit.' )}
                {verification?.kycStatus === 'under_review' && 'Your application is currently being reviewed by the admin team. This usually takes 1-2 business days.'}
                {verification?.kycStatus === 'submitted' && 'Your documents have been submitted and are pending review by the admin team.'}
                {(!verification || verification?.kycStatus === 'pending') && 'Complete your registration to start the verification process.'}
              </p>
            </div>
          </div>
          
          {verification?.kycStatus === 'rejected' && (
            <div className="mt-4 flex items-center gap-3">
              <Link
                to="/vendor/register"
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-xl text-sm font-medium hover:from-blue-600 hover:to-indigo-700 transition"
              >
                <RefreshCw size={16} /> Re-submit Application
              </Link>
              <Link
                to="/help"
                className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-medium text-gray-600 bg-white border border-gray-300 rounded-xl hover:bg-gray-50 transition"
              >
                <Info size={16} /> Contact Support
              </Link>
            </div>
          )}
        </div>

        {verification?.kycStatus === 'verified' && (
          <div className="mb-8 bg-white rounded-2xl border border-gray-200 p-6">
            <div className="flex items-center gap-3 mb-4">
              <CheckCircle className="text-green-500" size={24} />
              <h2 className="text-lg font-bold text-gray-900">Welcome to the Vendor Community!</h2>
            </div>
            <p className="text-sm text-gray-600 mb-4">
              Your account is fully approved. Here's what you can do now:
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <Link
                to="/vendor/products"
                className="p-4 bg-blue-50 rounded-xl hover:bg-blue-100 transition"
              >
                <p className="font-medium text-blue-700 text-sm">Add Products</p>
                <p className="text-xs text-blue-500 mt-1">Start listing your services</p>
              </Link>
              <Link
                to="/vendor/dashboard"
                className="p-4 bg-green-50 rounded-xl hover:bg-green-100 transition"
              >
                <p className="font-medium text-green-700 text-sm">View Dashboard</p>
                <p className="text-xs text-green-500 mt-1">Manage your business</p>
              </Link>
              <Link
                to="/vendor/settings"
                className="p-4 bg-purple-50 rounded-xl hover:bg-purple-100 transition"
              >
                <p className="font-medium text-purple-700 text-sm">Edit Profile</p>
                <p className="text-xs text-purple-500 mt-1">Update business info</p>
              </Link>
            </div>
          </div>
        )}

        {/* Verification Progress Timeline */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 md:p-8 mb-8">
          <h2 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
            <Shield size={20} className="text-blue-500" />
            Verification Progress
          </h2>

          <div className="space-y-0">
            {VERIFICATION_STEPS.map((step, index) => {
              const stepNumber = index + 1;
              const isCompleted = currentStep > stepNumber;
              const isCurrent = currentStep === stepNumber;
              const isPending = currentStep < stepNumber;

              return (
                <div key={step.id} className="relative flex items-start gap-4 pb-8 last:pb-0">
                  {/* Connector Line */}
                  {index < VERIFICATION_STEPS.length - 1 && (
                    <div className={`absolute left-5 top-10 w-0.5 h-8 ${
                      isCompleted ? "bg-green-500" : "bg-gray-200"
                    }`} />
                  )}

                  {/* Step Circle */}
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 z-10 ${
                    isCompleted 
                      ? "bg-green-500 text-white" 
                      : isCurrent 
                        ? "bg-blue-500 text-white ring-4 ring-blue-100" 
                        : "bg-gray-200 text-gray-400"
                  }`}>
                    {isCompleted ? (
                      <CheckCircle size={20} />
                    ) : (
                      <span className="text-sm font-bold">{stepNumber}</span>
                    )}
                  </div>

                  {/* Step Content */}
                  <div className="flex-1 pt-1.5">
                    <h3 className={`font-semibold ${
                      isCompleted ? "text-green-700" : isCurrent ? "text-blue-700" : "text-gray-400"
                    }`}>
                      {step.label}
                    </h3>
                    <p className={`text-sm mt-0.5 ${
                      isCompleted ? "text-green-500" : isCurrent ? "text-blue-400" : "text-gray-400"
                    }`}>
                      {step.description}
                    </p>
                    
                    {isCurrent && (
                      <div className="mt-3 flex items-center gap-2">
                        <div className="flex items-center gap-1.5 text-xs text-blue-500 bg-blue-50 px-3 py-1.5 rounded-lg">
                          <Clock size={12} />
                          In progress
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Business Details Card */}
        {business && (
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 md:p-8 mb-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                <Building2 size={20} className="text-gray-500" />
                Business Profile
              </h2>
              <button
                onClick={() => setShowDetails(!showDetails)}
                className="flex items-center gap-1.5 text-sm text-blue-600 hover:text-blue-700"
              >
                <Eye size={16} />
                {showDetails ? "Hide Details" : "View Details"}
              </button>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <p className="text-xs text-gray-500">Business Name</p>
                <p className="text-sm font-medium text-gray-900">{business.name || "—"}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Category</p>
                <p className="text-sm font-medium text-gray-900">{business.category || "—"}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">City</p>
                <p className="text-sm font-medium text-gray-900">{business.city || "—"}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Status</p>
                <span className={`inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-full mt-0.5 ${
                  business.approved 
                    ? "bg-green-50 text-green-700" 
                    : "bg-amber-50 text-amber-700"
                }`}>
                  {business.approved ? "Approved" : "Pending"}
                </span>
              </div>
            </div>

            {showDetails && business && (
              <div className="mt-4 pt-4 border-t border-gray-100 space-y-3">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-500">Plan:</span>
                    <span className="ml-2 font-medium">{business.plan || "Free"}</span>
                  </div>
                  <div>
                    <span className="text-gray-500">Profile Completion:</span>
                    <span className="ml-2 font-medium">{business.profileCompletion || 0}%</span>
                  </div>
                  <div>
                    <span className="text-gray-500">KYC Status:</span>
                    <span className="ml-2 font-medium">{business.kycStatus || "pending"}</span>
                  </div>
                  <div>
                    <span className="text-gray-500">Verified Badge:</span>
                    <span className="ml-2 font-medium">{business.verifiedBadge ? "Yes" : "No"}</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Registration Info */}
        {verification && (
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
              <FileText size={20} className="text-gray-500" />
              Registration Details
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div>
                <p className="text-gray-500">Submitted</p>
                <p className="font-medium text-gray-900">
                  {verification.submittedAt 
                    ? new Date(verification.submittedAt).toLocaleDateString('en-IN', {
                        day: 'numeric', month: 'short', year: 'numeric'
                      })
                    : "Not yet"}
                </p>
              </div>
              <div>
                <p className="text-gray-500">Last Updated</p>
                <p className="font-medium text-gray-900">
                  {verification.createdAt 
                    ? new Date(verification.createdAt).toLocaleDateString('en-IN', {
                        day: 'numeric', month: 'short', year: 'numeric'
                      })
                    : "—"}
                </p>
              </div>
              <div>
                <p className="text-gray-500">Resubmissions</p>
                <p className="font-medium text-gray-900">{verification.resubmissionCount || 0}</p>
              </div>
            </div>
          </div>
        )}

        {/* Not Registered Yet Prompt */}
        {!verification && vendorStatus?.role === 'business_owner' && (
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-8 text-center">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-400 to-indigo-500 flex items-center justify-center mx-auto mb-4">
              <Upload className="text-white" size={32} />
            </div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">Complete Your Registration</h2>
            <p className="text-sm text-gray-500 mb-6">
              You've created a vendor account but haven't completed the full registration process yet.
              Complete the multi-step registration to start receiving leads.
            </p>
            <Link
              to="/vendor/register"
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-xl font-medium hover:from-blue-600 hover:to-indigo-700 transition shadow-sm"
            >
              Continue Registration <ChevronRight size={18} />
            </Link>
          </div>
        )}
      </div>
    </main>
  );
};

export default VendorVerification;