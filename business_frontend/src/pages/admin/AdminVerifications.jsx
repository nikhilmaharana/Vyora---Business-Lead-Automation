import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { api, getUser, isAuthenticated } from "../../services/api";
import {
  Shield, Search, CheckCircle, XCircle, Clock, AlertCircle,
  User, Building2, Mail, Phone, MapPin, FileText, Eye,
  ChevronDown, ChevronUp, Filter, RefreshCw, Loader2,
  ThumbsUp, ThumbsDown, MessageSquare, Info
} from "lucide-react";

const AdminVerifications = () => {
  const navigate = useNavigate();
  const [verifications, setVerifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [actionLoading, setActionLoading] = useState(null);
  const [expandedId, setExpandedId] = useState(null);
  const [rejectionModal, setRejectionModal] = useState(null);
  const [rejectionReason, setRejectionReason] = useState("");

  useEffect(() => {
    const user = getUser();
    if (!isAuthenticated() || !user || (user.role !== "admin" && user.role !== "super_admin")) {
      navigate("/admin/login");
      return;
    }
    fetchVerifications();
  }, []);

  const fetchVerifications = async () => {
    setLoading(true);
    try {
      const data = await api("/admin/verifications");
      setVerifications(data.verifications || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (verificationId, kycStatus) => {
    if (kycStatus === 'rejected' && !rejectionReason.trim()) {
      setRejectionModal(verificationId);
      return;
    }
    
    setActionLoading(verificationId);
    setError("");
    try {
      const body = { kycStatus };
      if (kycStatus === 'rejected' && rejectionReason.trim()) {
        body.rejectionReason = rejectionReason.trim();
      }
      
      await api(`/admin/verifications/${verificationId}/status`, {
        method: "PATCH",
        body
      });
      
      setVerifications(prev => prev.map(v => 
        v.id === verificationId ? { ...v, kycStatus } : v
      ));
      setRejectionModal(null);
      setRejectionReason("");
    } catch (err) {
      setError(err.message);
    } finally {
      setActionLoading(null);
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'verified':
        return <span className="flex items-center gap-1 text-xs bg-emerald-500/10 text-emerald-400 px-2.5 py-1 rounded-full"><CheckCircle size={12} /> Verified</span>;
      case 'rejected':
        return <span className="flex items-center gap-1 text-xs bg-red-500/10 text-red-400 px-2.5 py-1 rounded-full"><XCircle size={12} /> Rejected</span>;
      case 'under_review':
        return <span className="flex items-center gap-1 text-xs bg-blue-500/10 text-blue-400 px-2.5 py-1 rounded-full"><Clock size={12} /> Under Review</span>;
      case 'submitted':
        return <span className="flex items-center gap-1 text-xs bg-indigo-500/10 text-indigo-400 px-2.5 py-1 rounded-full"><FileText size={12} /> Submitted</span>;
      default:
        return <span className="flex items-center gap-1 text-xs bg-amber-500/10 text-amber-400 px-2.5 py-1 rounded-full"><Clock size={12} /> Pending</span>;
    }
  };

  const filteredVerifications = verifications.filter(v => {
    const matchesSearch = 
      v.vendorName?.toLowerCase().includes(search.toLowerCase()) ||
      v.vendorEmail?.toLowerCase().includes(search.toLowerCase()) ||
      v.businessName?.toLowerCase().includes(search.toLowerCase()) ||
      v.businessCategory?.toLowerCase().includes(search.toLowerCase());
    
    if (filter === "all") return matchesSearch;
    return matchesSearch && v.kycStatus === filter;
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0F172A] flex items-center justify-center">
        <div className="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-indigo-500 border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0F172A]">
      {/* Header */}
      <div className="border-b border-white/5 bg-[#1E293B]/50 backdrop-blur-md px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Shield className="text-indigo-400" size={24} />
            <div>
              <h1 className="text-xl font-bold text-white">Verification Requests</h1>
              <p className="text-xs text-gray-400">Review and verify vendor KYC documents</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={fetchVerifications}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-300 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition"
            >
              <RefreshCw size={16} />
              Refresh
            </button>
            <button onClick={() => navigate("/admin/dashboard")} className="text-sm text-indigo-400 hover:text-indigo-300">
              ← Back to Dashboard
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {error && (
          <div className="mb-6 bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3 text-sm text-red-400 flex items-center gap-2">
            <AlertCircle size={16} />
            {error}
          </div>
        )}

        {/* Stats Cards */}
        <div className="grid grid-cols-5 gap-4 mb-8">
          <div className="bg-[#1E293B] rounded-xl border border-white/5 p-4">
            <p className="text-2xl font-bold text-white">{verifications.length}</p>
            <p className="text-sm text-gray-400">Total</p>
          </div>
          <div className="bg-[#1E293B] rounded-xl border border-white/5 p-4">
            <p className="text-2xl font-bold text-amber-400">{verifications.filter(v => v.kycStatus === 'pending' || v.kycStatus === 'submitted').length}</p>
            <p className="text-sm text-gray-400">New</p>
          </div>
          <div className="bg-[#1E293B] rounded-xl border border-white/5 p-4">
            <p className="text-2xl font-bold text-blue-400">{verifications.filter(v => v.kycStatus === 'under_review').length}</p>
            <p className="text-sm text-gray-400">In Review</p>
          </div>
          <div className="bg-[#1E293B] rounded-xl border border-white/5 p-4">
            <p className="text-2xl font-bold text-emerald-400">{verifications.filter(v => v.kycStatus === 'verified').length}</p>
            <p className="text-sm text-gray-400">Verified</p>
          </div>
          <div className="bg-[#1E293B] rounded-xl border border-white/5 p-4">
            <p className="text-2xl font-bold text-red-400">{verifications.filter(v => v.kycStatus === 'rejected').length}</p>
            <p className="text-sm text-gray-400">Rejected</p>
          </div>
        </div>

        {/* Filters */}
        <div className="flex items-center gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
            <input
              type="text"
              placeholder="Search by vendor name, email, business or category..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-[#1E293B] border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500"
            />
          </div>
          <div className="flex gap-2">
            {["all", "submitted", "under_review", "verified", "rejected"].map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                  filter === f 
                    ? "bg-indigo-500/20 text-indigo-400 border border-indigo-500/30" 
                    : "bg-[#1E293B] text-gray-400 border border-white/5 hover:border-white/10"
                }`}
              >
                {f === 'under_review' ? 'In Review' : f.charAt(0).toUpperCase() + f.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Verification List */}
        <div className="space-y-4">
          {filteredVerifications.map((verification) => (
            <div key={verification.id} className="bg-[#1E293B] rounded-2xl border border-white/5 overflow-hidden">
              {/* Main Card */}
              <div className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-4 flex-1">
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold text-xl">
                      {verification.vendorName?.charAt(0) || "V"}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-1">
                        <h3 className="text-lg font-bold text-white">{verification.vendorName}</h3>
                        {getStatusBadge(verification.kycStatus)}
                      </div>
                      <div className="flex items-center gap-4 mt-2 text-sm text-gray-400">
                        <span className="flex items-center gap-1.5"><Mail size={14} /> {verification.vendorEmail}</span>
                        <span className="flex items-center gap-1.5"><Phone size={14} /> {verification.vendorPhone}</span>
                      </div>
                      <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                        <span className="flex items-center gap-1.5"><Building2 size={14} /> {verification.businessName || verification.businessName || "—"}</span>
                        <span className="flex items-center gap-1.5"><FileText size={14} /> {verification.businessCategory || verification.category || "—"}</span>
                        <span className="flex items-center gap-1.5"><MapPin size={14} /> {verification.businessCity || verification.city || "—"}</span>
                      </div>
                      <p className="mt-1 text-xs text-gray-600">
                        Submitted: {verification.submittedAt ? new Date(verification.submittedAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }) : "—"}
                        {verification.resubmissionCount > 0 && ` • Resubmissions: ${verification.resubmissionCount}`}
                      </p>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex items-center gap-2 ml-4">
                    {(verification.kycStatus === 'submitted' || verification.kycStatus === 'pending') && (
                      <>
                        <button
                          onClick={() => {
                            setRejectionReason("");
                            handleStatusUpdate(verification.id, 'verified');
                          }}
                          disabled={actionLoading === verification.id}
                          className="flex items-center gap-1.5 text-xs px-4 py-2 rounded-lg font-medium bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 transition disabled:opacity-50"
                        >
                          {actionLoading === verification.id ? (
                            <Loader2 size={14} className="animate-spin" />
                          ) : (
                            <ThumbsUp size={14} />
                          )}
                          Verify
                        </button>
                        <button
                          onClick={() => setRejectionModal(verification.id)}
                          disabled={actionLoading === verification.id}
                          className="flex items-center gap-1.5 text-xs px-4 py-2 rounded-lg font-medium bg-red-500/10 text-red-400 hover:bg-red-500/20 transition disabled:opacity-50"
                        >
                          <ThumbsDown size={14} />
                          Reject
                        </button>
                      </>
                    )}
                    {verification.kycStatus === 'under_review' && (
                      <>
                        <button
                          onClick={() => handleStatusUpdate(verification.id, 'verified')}
                          disabled={actionLoading === verification.id}
                          className="flex items-center gap-1.5 text-xs px-4 py-2 rounded-lg font-medium bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 transition disabled:opacity-50"
                        >
                          <CheckCircle size={14} />
                          Approve
                        </button>
                        <button
                          onClick={() => setRejectionModal(verification.id)}
                          disabled={actionLoading === verification.id}
                          className="flex items-center gap-1.5 text-xs px-4 py-2 rounded-lg font-medium bg-red-500/10 text-red-400 hover:bg-red-500/20 transition disabled:opacity-50"
                        >
                          <XCircle size={14} />
                          Reject
                        </button>
                      </>
                    )}
                    <button
                      onClick={() => setExpandedId(expandedId === verification.id ? null : verification.id)}
                      className="p-2 text-gray-500 hover:text-white transition"
                    >
                      {expandedId === verification.id ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                    </button>
                  </div>
                </div>
              </div>

              {/* Expanded Details */}
              {expandedId === verification.id && (
                <div className="border-t border-white/5 bg-white/[0.02] p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Business Info */}
                    <div>
                      <h4 className="text-sm font-semibold text-gray-300 mb-3 flex items-center gap-2">
                        <Building2 size={16} className="text-indigo-400" /> Business Information
                      </h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-500">Business Name</span>
                          <span className="text-gray-300">{verification.businessName || "—"}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-500">Business Type</span>
                          <span className="text-gray-300">{verification.businessType || "—"}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-500">Category</span>
                          <span className="text-gray-300">{verification.businessCategory || verification.category || "—"}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-500">Sub Category</span>
                          <span className="text-gray-300">{verification.subCategory || "—"}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-500">Years in Business</span>
                          <span className="text-gray-300">{verification.yearsInBusiness || "—"}</span>
                        </div>
                        {verification.description && (
                          <div className="pt-2">
                            <span className="text-gray-500 block mb-1">Description</span>
                            <p className="text-gray-300 text-xs leading-relaxed">{verification.description}</p>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Contact Info */}
                    <div>
                      <h4 className="text-sm font-semibold text-gray-300 mb-3 flex items-center gap-2">
                        <Mail size={16} className="text-indigo-400" /> Contact Details
                      </h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-500">Business Email</span>
                          <span className="text-gray-300">{verification.businessEmail || "—"}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-500">Business Phone</span>
                          <span className="text-gray-300">{verification.businessPhone || "—"}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-500">City</span>
                          <span className="text-gray-300">{verification.city || "—"}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-500">State</span>
                          <span className="text-gray-300">{verification.state || "—"}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-500">Pincode</span>
                          <span className="text-gray-300">{verification.pincode || "—"}</span>
                        </div>
                        {verification.website && (
                          <div className="flex justify-between">
                            <span className="text-gray-500">Website</span>
                            <span className="text-gray-300 text-xs truncate max-w-[200px]">{verification.website}</span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* KYC Documents */}
                    <div>
                      <h4 className="text-sm font-semibold text-gray-300 mb-3 flex items-center gap-2">
                        <Shield size={16} className="text-indigo-400" /> KYC Documents
                      </h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-500">Document Type</span>
                          <span className="text-gray-300">{verification.documentType || "—"}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-500">Document Number</span>
                          <span className="text-gray-300">{verification.documentNumber ? `****${verification.documentNumber.slice(-4)}` : "—"}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-500">GSTIN</span>
                          <span className="text-gray-300">{verification.gstin || "—"}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-500">PAN Number</span>
                          <span className="text-gray-300">{verification.panNumber ? `****${verification.panNumber.slice(-4)}` : "—"}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-500">Business Proof</span>
                          <span className="text-gray-300">{verification.businessProofType || "—"}</span>
                        </div>
                      </div>
                    </div>

                    {/* Social & Additional */}
                    <div>
                      <h4 className="text-sm font-semibold text-gray-300 mb-3 flex items-center gap-2">
                        <Info size={16} className="text-indigo-400" /> Additional Info
                      </h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-500">Service Areas</span>
                          <span className="text-gray-300">
                            {verification.serviceAreas?.length ? verification.serviceAreas.join(", ") : "—"}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-500">Profile Completion</span>
                          <span className="text-gray-300">{verification.profileCompletion || 0}%</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-500">Resubmissions</span>
                          <span className="text-gray-300">{verification.resubmissionCount || 0}</span>
                        </div>
                        {verification.additionalInfo && (
                          <div className="pt-2">
                            <span className="text-gray-500 block mb-1">Additional Notes</span>
                            <p className="text-gray-300 text-xs">{verification.additionalInfo}</p>
                          </div>
                        )}
                        {verification.rejectionReason && (
                          <div className="pt-2">
                            <span className="text-red-400 block mb-1 text-xs font-medium">Rejection Reason</span>
                            <p className="text-red-300 text-xs">{verification.rejectionReason}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Social Links */}
                  {verification.socialLinks && Object.values(verification.socialLinks).some(v => v) && (
                    <div className="mt-4 pt-4 border-t border-white/5">
                      <h4 className="text-sm font-semibold text-gray-300 mb-2">Social Links</h4>
                      <div className="flex flex-wrap gap-2">
                        {verification.socialLinks.facebook && (
                          <a href={verification.socialLinks.facebook} target="_blank" rel="noopener noreferrer" className="text-xs text-blue-400 hover:underline">Facebook</a>
                        )}
                        {verification.socialLinks.instagram && (
                          <a href={verification.socialLinks.instagram} target="_blank" rel="noopener noreferrer" className="text-xs text-pink-400 hover:underline">Instagram</a>
                        )}
                        {verification.socialLinks.linkedin && (
                          <a href={verification.socialLinks.linkedin} target="_blank" rel="noopener noreferrer" className="text-xs text-blue-400 hover:underline">LinkedIn</a>
                        )}
                        {verification.socialLinks.youtube && (
                          <a href={verification.socialLinks.youtube} target="_blank" rel="noopener noreferrer" className="text-xs text-red-400 hover:underline">YouTube</a>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}

          {filteredVerifications.length === 0 && (
            <div className="text-center py-16 bg-[#1E293B] rounded-2xl border border-white/5">
              <Shield className="mx-auto text-gray-500 mb-3" size={48} />
              <p className="text-gray-400 text-lg font-medium">No verification requests found</p>
              <p className="text-gray-500 text-sm mt-1">
                {search ? "Try a different search term" : "No vendors have submitted verification documents yet"}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Rejection Modal */}
      {rejectionModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-[#1E293B] rounded-2xl border border-white/10 p-6 max-w-md w-full shadow-xl">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-red-500/10 flex items-center justify-center">
                <MessageSquare className="text-red-400" size={20} />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">Reject Verification</h3>
                <p className="text-sm text-gray-400">Provide a reason for rejection</p>
              </div>
            </div>
            
            <textarea
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              placeholder="Enter the reason for rejection (required)..."
              rows={4}
              className="w-full bg-[#0F172A] border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-red-500 resize-none"
            />
            
            <div className="flex items-center justify-end gap-3 mt-4">
              <button
                onClick={() => {
                  setRejectionModal(null);
                  setRejectionReason("");
                }}
                className="px-4 py-2 text-sm font-medium text-gray-400 hover:text-white transition"
              >
                Cancel
              </button>
              <button
                onClick={() => handleStatusUpdate(rejectionModal, 'rejected')}
                disabled={!rejectionReason.trim() || actionLoading === rejectionModal}
                className="flex items-center gap-2 px-5 py-2 text-sm font-medium text-white bg-red-500 rounded-xl hover:bg-red-600 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {actionLoading === rejectionModal ? (
                  <Loader2 size={16} className="animate-spin" />
                ) : (
                  <XCircle size={16} />
                )}
                Reject & Notify
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminVerifications;