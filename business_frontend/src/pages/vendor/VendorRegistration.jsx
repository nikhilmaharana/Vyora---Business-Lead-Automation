import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { api, getUser, isAuthenticated } from "../../services/api";
import {
  Building2, Mail, Phone, MapPin, FileText, Shield,
  ChevronRight, ChevronLeft, Check, AlertCircle, CheckCircle,
  Upload, Globe, ExternalLink, Share2,
  Clock, Save, ArrowRight, Info, X, Plus, Loader2
} from "lucide-react";

const STEPS = [
  { id: 1, label: "Business Info", icon: Building2 },
  { id: 2, label: "Contact & Location", icon: MapPin },
  { id: 3, label: "Business Details", icon: FileText },
  { id: 4, label: "KYC Documents", icon: Shield },
  { id: 5, label: "Review & Submit", icon: CheckCircle }
];

const BUSINESS_TYPES = ["Individual", "Partnership", "Private Limited", "LLP", "Public Limited", "Other"];
const DOCUMENT_TYPES = ["Aadhaar", "PAN", "GST", "Trade License", "MSME", "Other"];
const PROOF_TYPES = ["Electricity Bill", "Rent Agreement", "Property Tax Receipt", "Bank Statement", "Other"];
const CATEGORIES = [
  "Electronics & Gadgets", "Home Services", "Healthcare", "Education",
  "Automotive", "Fashion & Beauty", "Food & Dining", "Travel & Tourism",
  "Real Estate", "Legal & Financial", "IT & Software", "Event Planning",
  "Photography", "Fitness & Wellness", "Pet Services", "Other"
];
const SERVICE_AREAS = [
  "Local Only", "Within City", "Within State", "Nationwide", "International"
];

const VendorRegistration = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [savedProgress, setSavedProgress] = useState(false);
  const [existingDraft, setExistingDraft] = useState(null);

  const [form, setForm] = useState({
    // Step 1: Business Info
    businessName: "",
    businessType: "",
    
    // Step 2: Contact & Location
    businessEmail: "",
    businessPhone: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
    serviceAreas: [],
    
    // Step 3: Business Details
    category: "",
    subCategory: "",
    description: "",
    yearsInBusiness: "",
    website: "",
    socialLinks: {
      facebook: "",
      instagram: "",
      linkedin: "",
      youtube: ""
    },
    
    // Step 4: KYC Documents
    documentType: "",
    documentNumber: "",
    gstin: "",
    panNumber: "",
    businessProofType: "",
    additionalInfo: "",
    
    // Step 5: Additional
    agreeToTerms: false,
    agreeToVerification: false
  });

  const [files, setFiles] = useState({
    documentFile: null,
    businessProofFile: null
  });

  const [uploadErrors, setUploadErrors] = useState({});

  useEffect(() => {
    if (!isAuthenticated()) {
      navigate("/login", { state: { from: "/vendor/register" } });
      return;
    }
    
    const user = getUser();
    if (!user) {
      navigate("/login");
      return;
    }
    
    // Check if already a vendor
    checkVendorStatus();
    // Load saved draft
    loadDraft();
  }, []);

  const checkVendorStatus = async () => {
    try {
      const data = await api("/vendor/status");
      if (data.isApproved) {
        navigate("/vendor/dashboard");
      }
    } catch (err) {
      // Not an issue if endpoint isn't available yet
    }
  };

  const loadDraft = async () => {
    try {
      const data = await api("/vendor/registration/draft");
      if (data.draft && data.draft.formData) {
        setExistingDraft(data.draft);
        setForm(prev => ({
          ...prev,
          ...data.draft.formData
        }));
        setCurrentStep(data.draft.currentStep || 1);
      }
    } catch (err) {
      // No draft exists
    }
  };

  const updateForm = (field, value) => {
    setForm(prev => ({ ...prev, [field]: value }));
    setSavedProgress(false);
  };

  const updateSocialLink = (platform, value) => {
    setForm(prev => ({
      ...prev,
      socialLinks: { ...prev.socialLinks, [platform]: value }
    }));
    setSavedProgress(false);
  };

  const handleFileChange = (field, e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setUploadErrors(prev => ({ ...prev, [field]: "File size must be less than 5MB" }));
        return;
      }
      const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg', 'application/pdf'];
      if (!allowedTypes.includes(file.type)) {
        setUploadErrors(prev => ({ ...prev, [field]: "Only JPG, PNG, or PDF files are allowed" }));
        return;
      }
      setFiles(prev => ({ ...prev, [field]: file }));
      setUploadErrors(prev => ({ ...prev, [field]: "" }));
    }
  };

  const removeFile = (field) => {
    setFiles(prev => ({ ...prev, [field]: null }));
    setUploadErrors(prev => ({ ...prev, [field]: "" }));
  };

  const toggleServiceArea = (area) => {
    setForm(prev => ({
      ...prev,
      serviceAreas: prev.serviceAreas.includes(area)
        ? prev.serviceAreas.filter(a => a !== area)
        : [...prev.serviceAreas, area]
    }));
  };

  const saveDraft = async () => {
    setSavedProgress(false);
    try {
      await api("/vendor/registration/draft", {
        method: "POST",
        body: {
          formData: form,
          currentStep
        }
      });
      setSavedProgress(true);
      setTimeout(() => setSavedProgress(false), 3000);
    } catch (err) {
      setError("Failed to save draft");
    }
  };

  const validateStep = (step) => {
    setError("");
    
    switch (step) {
      case 1:
        if (!form.businessName.trim()) {
          setError("Business name is required");
          return false;
        }
        if (!form.businessType) {
          setError("Business type is required");
          return false;
        }
        return true;
      
      case 2:
        if (!form.businessEmail.trim() || !form.businessEmail.includes("@")) {
          setError("Valid business email is required");
          return false;
        }
        if (!form.businessPhone.trim() || form.businessPhone.replace(/\D/g, "").length < 10) {
          setError("Valid business phone number is required (10+ digits)");
          return false;
        }
        if (!form.city.trim()) {
          setError("City is required");
          return false;
        }
        if (!form.state.trim()) {
          setError("State is required");
          return false;
        }
        return true;
      
      case 3:
        if (!form.category) {
          setError("Business category is required");
          return false;
        }
        if (!form.description.trim() || form.description.trim().length < 20) {
          setError("Description must be at least 20 characters");
          return false;
        }
        return true;
      
      case 4:
        if (!form.documentType) {
          setError("Document type is required for KYC");
          return false;
        }
        if (!form.documentNumber.trim()) {
          setError("Document number is required");
          return false;
        }
        if (!files.documentFile && !existingDraft?.formData?.documentFile) {
          setError("Please upload a document file");
          return false;
        }
        return true;
      
      case 5:
        if (!form.agreeToTerms) {
          setError("You must agree to the terms and conditions");
          return false;
        }
        if (!form.agreeToVerification) {
          setError("You must consent to verification");
          return false;
        }
        return true;
      
      default:
        return true;
    }
  };

  const nextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, 5));
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const prevStep = () => {
    setError("");
    setCurrentStep(prev => Math.max(prev - 1, 1));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSubmit = async () => {
    if (!validateStep(5)) return;
    
    setLoading(true);
    setError("");
    setSuccess("");
    
    try {
      const formData = new FormData();
      
      // Append all form fields
      Object.entries(form).forEach(([key, value]) => {
        if (key !== 'socialLinks') {
          if (typeof value === 'object' && value !== null) {
            formData.append(key, JSON.stringify(value));
          } else {
            formData.append(key, value);
          }
        }
      });
      
      // Append social links
      formData.append('socialLinks', JSON.stringify(form.socialLinks));
      
      // Append files
      if (files.documentFile) {
        formData.append('documentFile', files.documentFile);
      }
      if (files.businessProofFile) {
        formData.append('businessProofFile', files.businessProofFile);
      }
      
      const data = await api("/vendor/registration/submit", {
        method: "POST",
        body: formData,
        headers: {} // Let fetch set Content-Type for FormData
      });
      
      setSuccess(data.message || "Registration submitted successfully! Awaiting admin approval.");
      
      // Redirect to dashboard after short delay
      setTimeout(() => {
        navigate("/vendor/dashboard");
      }, 2000);
    } catch (err) {
      setError(err.message || "Failed to submit registration");
    } finally {
      setLoading(false);
    }
  };

  const calculateCompletion = () => {
    let completed = 0;
    if (form.businessName && form.businessType) completed += 20;
    if (form.businessEmail && form.businessPhone && form.city && form.state) completed += 20;
    if (form.category && form.description) completed += 20;
    if (form.documentType && form.documentNumber) completed += 20;
    if (form.agreeToTerms && form.agreeToVerification) completed += 20;
    return completed;
  };

  const renderProgress = () => {
    const completion = calculateCompletion();
    return (
      <div className="mb-8">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-600">Profile Completion</span>
          <span className="text-sm font-bold text-green-600">{completion}%</span>
        </div>
        <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-green-400 to-green-600 rounded-full transition-all duration-500"
            style={{ width: `${completion}%` }}
          />
        </div>
      </div>
    );
  };

  const renderStepIndicator = () => (
    <div className="mb-10">
      <div className="flex items-center justify-between">
        {STEPS.map((step, index) => {
          const StepIcon = step.icon;
          const isActive = currentStep === step.id;
          const isCompleted = currentStep > step.id;
          
          return (
            <div key={step.id} className="flex items-center flex-1">
              <div className="flex flex-col items-center">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 ${
                  isActive 
                    ? "bg-green-500 text-white shadow-lg shadow-green-200 scale-110" 
                    : isCompleted 
                      ? "bg-green-500 text-white" 
                      : "bg-gray-200 text-gray-400"
                }`}>
                  {isCompleted ? <Check size={20} /> : <StepIcon size={20} />}
                </div>
                <span className={`mt-2 text-xs font-medium hidden md:block ${
                  isActive ? "text-green-600" : isCompleted ? "text-green-500" : "text-gray-400"
                }`}>
                  {step.label}
                </span>
              </div>
              {index < STEPS.length - 1 && (
                <div className={`flex-1 h-0.5 mx-2 mt-[-1.5rem] ${
                  isCompleted ? "bg-green-500" : "bg-gray-200"
                }`} />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );

  const renderStep1 = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-bold text-gray-900 mb-1">Basic Business Information</h3>
        <p className="text-sm text-gray-500">Tell us about your business</p>
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1.5">
          Business Name <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          value={form.businessName}
          onChange={(e) => updateForm("businessName", e.target.value)}
          placeholder="Enter your business name"
          className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-100 transition"
        />
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1.5">
          Business Type <span className="text-red-500">*</span>
        </label>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {BUSINESS_TYPES.map(type => (
            <button
              key={type}
              type="button"
              onClick={() => updateForm("businessType", type)}
              className={`p-3 rounded-xl border text-sm font-medium transition ${
                form.businessType === type
                  ? "border-green-500 bg-green-50 text-green-700"
                  : "border-gray-200 bg-white text-gray-600 hover:border-gray-300"
              }`}
            >
              {type}
            </button>
          ))}
        </div>
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-bold text-gray-900 mb-1">Contact & Location Details</h3>
        <p className="text-sm text-gray-500">How customers can reach you</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            Business Email <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="email"
              value={form.businessEmail}
              onChange={(e) => updateForm("businessEmail", e.target.value)}
              placeholder="business@example.com"
              className="w-full rounded-xl border border-gray-300 pl-10 pr-4 py-3 text-sm focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-100 transition"
            />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            Business Phone <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="tel"
              value={form.businessPhone}
              onChange={(e) => updateForm("businessPhone", e.target.value)}
              placeholder="+91 98765 43210"
              className="w-full rounded-xl border border-gray-300 pl-10 pr-4 py-3 text-sm focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-100 transition"
            />
          </div>
        </div>
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1.5">Address</label>
        <textarea
          value={form.address}
          onChange={(e) => updateForm("address", e.target.value)}
          placeholder="Full business address"
          rows={2}
          className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-100 transition resize-none"
        />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            City <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              value={form.city}
              onChange={(e) => updateForm("city", e.target.value)}
              placeholder="City"
              className="w-full rounded-xl border border-gray-300 pl-10 pr-4 py-3 text-sm focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-100 transition"
            />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            State <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={form.state}
            onChange={(e) => updateForm("state", e.target.value)}
            placeholder="State"
            className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-100 transition"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Pincode</label>
          <input
            type="text"
            value={form.pincode}
            onChange={(e) => updateForm("pincode", e.target.value.replace(/\D/g, "").slice(0, 6))}
            placeholder="Pincode"
            maxLength={6}
            className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-100 transition"
          />
        </div>
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Service Areas</label>
        <div className="flex flex-wrap gap-2">
          {SERVICE_AREAS.map(area => (
            <button
              key={area}
              type="button"
              onClick={() => toggleServiceArea(area)}
              className={`px-4 py-2 rounded-full text-xs font-medium border transition ${
                form.serviceAreas.includes(area)
                  ? "border-green-500 bg-green-50 text-green-700"
                  : "border-gray-200 bg-white text-gray-600 hover:border-gray-300"
              }`}
            >
              {area}
            </button>
          ))}
        </div>
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-bold text-gray-900 mb-1">Business Details</h3>
        <p className="text-sm text-gray-500">Tell us more about what you do</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            Category <span className="text-red-500">*</span>
          </label>
          <select
            value={form.category}
            onChange={(e) => updateForm("category", e.target.value)}
            className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-100 transition"
          >
            <option value="">Select category</option>
            {CATEGORIES.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Sub Category</label>
          <input
            type="text"
            value={form.subCategory}
            onChange={(e) => updateForm("subCategory", e.target.value)}
            placeholder="e.g., Mobile Repair, AC Service"
            className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-100 transition"
          />
        </div>
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1.5">
          Business Description <span className="text-red-500">*</span>
        </label>
        <textarea
          value={form.description}
          onChange={(e) => updateForm("description", e.target.value)}
          placeholder="Describe your business, services, and what makes you unique (minimum 20 characters)"
          rows={4}
          className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-100 transition resize-none"
        />
        <p className="mt-1 text-xs text-gray-400">{form.description.length} characters (min 20)</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Years in Business</label>
          <input
            type="number"
            value={form.yearsInBusiness}
            onChange={(e) => updateForm("yearsInBusiness", e.target.value)}
            placeholder="Years"
            min={0}
            max={100}
            className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-100 transition"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Website</label>
          <div className="relative">
            <Globe className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="url"
              value={form.website}
              onChange={(e) => updateForm("website", e.target.value)}
              placeholder="https://example.com"
              className="w-full rounded-xl border border-gray-300 pl-10 pr-4 py-3 text-sm focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-100 transition"
            />
          </div>
        </div>
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">Social Media Links</label>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div className="relative">
            <Globe className="absolute left-3 top-1/2 -translate-y-1/2 text-blue-600" size={18} />
            <input
              type="url"
              value={form.socialLinks.facebook}
              onChange={(e) => updateSocialLink("facebook", e.target.value)}
              placeholder="Facebook URL"
              className="w-full rounded-xl border border-gray-300 pl-10 pr-4 py-3 text-sm focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-100 transition"
            />
          </div>
          <div className="relative">
            <InstagramIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-pink-600" size={18} />
            <input
              type="url"
              value={form.socialLinks.instagram}
              onChange={(e) => updateSocialLink("instagram", e.target.value)}
              placeholder="Instagram URL"
              className="w-full rounded-xl border border-gray-300 pl-10 pr-4 py-3 text-sm focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-100 transition"
            />
          </div>
          <div className="relative">
            <Globe className="absolute left-3 top-1/2 -translate-y-1/2 text-blue-700" size={18} />
            <input
              type="url"
              value={form.socialLinks.linkedin}
              onChange={(e) => updateSocialLink("linkedin", e.target.value)}
              placeholder="LinkedIn URL"
              className="w-full rounded-xl border border-gray-300 pl-10 pr-4 py-3 text-sm focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-100 transition"
            />
          </div>
          <div className="relative">
            <Globe className="absolute left-3 top-1/2 -translate-y-1/2 text-red-600" size={18} />
            <input
              type="url"
              value={form.socialLinks.youtube}
              onChange={(e) => updateSocialLink("youtube", e.target.value)}
              placeholder="YouTube URL"
              className="w-full rounded-xl border border-gray-300 pl-10 pr-4 py-3 text-sm focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-100 transition"
            />
          </div>
        </div>
      </div>
    </div>
  );

  const InstagramIcon = ({ className, size }) => (
    <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
    </svg>
  );

  const renderFileUpload = (field, label, acceptedTypes = ".jpg,.jpeg,.png,.pdf") => (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1.5">{label}</label>
      {files[field] ? (
        <div className="flex items-center gap-3 p-3 bg-green-50 border border-green-200 rounded-xl">
          <FileText className="text-green-500" size={20} />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-green-700 truncate">{files[field].name}</p>
            <p className="text-xs text-green-500">{(files[field].size / 1024).toFixed(1)} KB</p>
          </div>
          <button
            type="button"
            onClick={() => removeFile(field)}
            className="p-1 hover:bg-green-100 rounded-lg text-green-600"
          >
            <X size={16} />
          </button>
        </div>
      ) : (
        <label className="flex flex-col items-center justify-center h-32 border-2 border-dashed border-gray-300 rounded-xl cursor-pointer hover:border-green-400 hover:bg-green-50/50 transition">
          <Upload className="text-gray-400 mb-2" size={24} />
          <span className="text-sm text-gray-500">Click to upload {label}</span>
          <span className="text-xs text-gray-400 mt-1">JPG, PNG or PDF (max 5MB)</span>
          <input
            type="file"
            accept={acceptedTypes}
            onChange={(e) => handleFileChange(field, e)}
            className="hidden"
          />
        </label>
      )}
      {uploadErrors[field] && (
        <p className="mt-1 text-xs text-red-500 flex items-center gap-1">
          <AlertCircle size={12} /> {uploadErrors[field]}
        </p>
      )}
    </div>
  );

  const renderStep4 = () => (
    <div className="space-y-6">
      <div>
        <div className="flex items-center gap-2 mb-1">
          <Shield className="text-green-600" size={20} />
          <h3 className="text-lg font-bold text-gray-900">KYC Documents</h3>
        </div>
        <p className="text-sm text-gray-500">Verify your identity and business</p>
      </div>
      
      <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
        <div className="flex items-start gap-3">
          <Info className="text-amber-500 mt-0.5" size={18} />
          <div>
            <p className="text-sm font-medium text-amber-800">Why we need this?</p>
            <p className="text-xs text-amber-700 mt-1">
              We need to verify your identity to ensure trust and authenticity on our platform. 
              Your documents are encrypted and stored securely.
            </p>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            Document Type <span className="text-red-500">*</span>
          </label>
          <select
            value={form.documentType}
            onChange={(e) => updateForm("documentType", e.target.value)}
            className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-100 transition"
          >
            <option value="">Select document type</option>
            {DOCUMENT_TYPES.map(type => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            Document Number <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={form.documentNumber}
            onChange={(e) => updateForm("documentNumber", e.target.value)}
            placeholder="Document number"
            className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-100 transition"
          />
        </div>
      </div>
      
      {renderFileUpload("documentFile", "Upload Document *")}
      
      <div className="border-t border-gray-200 pt-6">
        <h4 className="text-sm font-semibold text-gray-700 mb-4">Optional Documents</h4>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">GSTIN</label>
            <input
              type="text"
              value={form.gstin}
              onChange={(e) => updateForm("gstin", e.target.value.toUpperCase().slice(0, 15))}
              placeholder="GSTIN (15 characters)"
              maxLength={15}
              className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-100 transition"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">PAN Number</label>
            <input
              type="text"
              value={form.panNumber}
              onChange={(e) => updateForm("panNumber", e.target.value.toUpperCase().slice(0, 10))}
              placeholder="PAN (10 characters)"
              maxLength={10}
              className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-100 transition"
            />
          </div>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Business Proof Type</label>
          <select
            value={form.businessProofType}
            onChange={(e) => updateForm("businessProofType", e.target.value)}
            className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-100 transition"
          >
            <option value="">Select proof type</option>
            {PROOF_TYPES.map(type => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
        </div>
        
        {renderFileUpload("businessProofFile", "Upload Business Proof")}
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1.5">Additional Information</label>
        <textarea
          value={form.additionalInfo}
          onChange={(e) => updateForm("additionalInfo", e.target.value)}
          placeholder="Any additional information you'd like to share"
          rows={2}
          className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-100 transition resize-none"
        />
      </div>
    </div>
  );

  const renderStep5 = () => (
    <div className="space-y-6">
      <div>
        <div className="flex items-center gap-2 mb-1">
          <CheckCircle className="text-green-600" size={20} />
          <h3 className="text-lg font-bold text-gray-900">Review & Submit</h3>
        </div>
        <p className="text-sm text-gray-500">Please review your information before submitting</p>
      </div>
      
      {/* Summary Cards */}
      <div className="space-y-4">
        <div className="bg-white border border-gray-200 rounded-xl p-4">
          <h4 className="text-sm font-semibold text-gray-700 flex items-center gap-2 mb-3">
            <Building2 size={16} className="text-green-500" /> Business Info
          </h4>
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div><span className="text-gray-500">Name:</span> <span className="font-medium">{form.businessName || "—"}</span></div>
            <div><span className="text-gray-500">Type:</span> <span className="font-medium">{form.businessType || "—"}</span></div>
          </div>
        </div>
        
        <div className="bg-white border border-gray-200 rounded-xl p-4">
          <h4 className="text-sm font-semibold text-gray-700 flex items-center gap-2 mb-3">
            <MapPin size={16} className="text-green-500" /> Contact & Location
          </h4>
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div><span className="text-gray-500">Email:</span> <span className="font-medium">{form.businessEmail || "—"}</span></div>
            <div><span className="text-gray-500">Phone:</span> <span className="font-medium">{form.businessPhone || "—"}</span></div>
            <div><span className="text-gray-500">City:</span> <span className="font-medium">{form.city || "—"}</span></div>
            <div><span className="text-gray-500">State:</span> <span className="font-medium">{form.state || "—"}</span></div>
          </div>
        </div>
        
        <div className="bg-white border border-gray-200 rounded-xl p-4">
          <h4 className="text-sm font-semibold text-gray-700 flex items-center gap-2 mb-3">
            <FileText size={16} className="text-green-500" /> Business Details
          </h4>
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div><span className="text-gray-500">Category:</span> <span className="font-medium">{form.category || "—"}</span></div>
            <div><span className="text-gray-500">Years:</span> <span className="font-medium">{form.yearsInBusiness || "—"}</span></div>
          </div>
          {form.description && (
            <p className="mt-2 text-sm text-gray-600 line-clamp-2">{form.description}</p>
          )}
        </div>
        
        <div className="bg-white border border-gray-200 rounded-xl p-4">
          <h4 className="text-sm font-semibold text-gray-700 flex items-center gap-2 mb-3">
            <Shield size={16} className="text-green-500" /> KYC Documents
          </h4>
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div><span className="text-gray-500">Document:</span> <span className="font-medium">{form.documentType || "—"}</span></div>
            <div><span className="text-gray-500">Number:</span> <span className="font-medium">{form.documentNumber ? `****${form.documentNumber.slice(-4)}` : "—"}</span></div>
            <div><span className="text-gray-500">File:</span> <span className="font-medium">{files.documentFile?.name || "Uploaded" || "—"}</span></div>
          </div>
        </div>
      </div>
      
      {/* Agreements */}
      <div className="bg-gray-50 border border-gray-200 rounded-xl p-5 space-y-4">
        <label className="flex items-start gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={form.agreeToTerms}
            onChange={(e) => updateForm("agreeToTerms", e.target.checked)}
            className="mt-0.5 h-5 w-5 rounded border-gray-300 text-green-600 focus:ring-green-500"
          />
          <span className="text-sm text-gray-600">
            I confirm that all information provided is accurate and complete. I agree to the{" "}
            <Link to="/terms" className="text-green-600 hover:underline" target="_blank">Terms & Conditions</Link>{" "}
            and{" "}
            <Link to="/privacy" className="text-green-600 hover:underline" target="_blank">Privacy Policy</Link>.
            <span className="text-red-500"> *</span>
          </span>
        </label>
        
        <label className="flex items-start gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={form.agreeToVerification}
            onChange={(e) => updateForm("agreeToVerification", e.target.checked)}
            className="mt-0.5 h-5 w-5 rounded border-gray-300 text-green-600 focus:ring-green-500"
          />
          <span className="text-sm text-gray-600">
            I consent to the verification of my business documents and identity by the platform administrators.
            <span className="text-red-500"> *</span>
          </span>
        </label>
      </div>
    </div>
  );

  const renderStepContent = () => {
    switch (currentStep) {
      case 1: return renderStep1();
      case 2: return renderStep2();
      case 3: return renderStep3();
      case 4: return renderStep4();
      case 5: return renderStep5();
      default: return null;
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-50 to-green-50/30">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Vendor Registration</h1>
              <p className="text-sm text-gray-500 mt-1">Complete all steps to register your business</p>
            </div>
            <Link
              to="/"
              className="text-sm text-gray-500 hover:text-gray-700 flex items-center gap-1"
            >
              <ExternalLink size={14} /> Back to Home
            </Link>
          </div>
          {renderProgress()}
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-8">
        {/* Step Indicator */}
        {renderStepIndicator()}

        {/* Error / Success Messages */}
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-sm text-red-700 flex items-center gap-2">
            <AlertCircle size={16} />
            {error}
          </div>
        )}
        
        {success && (
          <div className="mb-6 bg-green-50 border border-green-200 rounded-xl px-4 py-3 text-sm text-green-700 flex items-center gap-2">
            <CheckCircle size={16} />
            {success}
          </div>
        )}

        {/* Main Form Card */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 md:p-8">
          {renderStepContent()}

          {/* Navigation Buttons */}
          <div className="flex items-center justify-between mt-8 pt-6 border-t border-gray-200">
            <div>
              {currentStep > 1 ? (
                <button
                  type="button"
                  onClick={prevStep}
                  className="flex items-center gap-2 px-5 py-2.5 text-sm font-medium text-gray-600 bg-white border border-gray-300 rounded-xl hover:bg-gray-50 transition"
                >
                  <ChevronLeft size={16} /> Previous
                </button>
              ) : (
                <div />
              )}
            </div>
            
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={saveDraft}
                className="flex items-center gap-2 px-5 py-2.5 text-sm font-medium text-gray-600 bg-white border border-gray-300 rounded-xl hover:bg-gray-50 transition"
              >
                <Save size={16} />
                {savedProgress ? "Saved!" : "Save Draft"}
              </button>
              
              {currentStep < 5 ? (
                <button
                  type="button"
                  onClick={nextStep}
                  className="flex items-center gap-2 px-6 py-2.5 text-sm font-medium text-white bg-green-500 rounded-xl hover:bg-green-600 transition shadow-sm"
                >
                  Next <ChevronRight size={16} />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={loading}
                  className="flex items-center gap-2 px-8 py-3 text-sm font-bold text-white bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl hover:from-green-600 hover:to-emerald-700 transition shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <>
                      <Loader2 size={18} className="animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    <>
                      <CheckCircle size={18} />
                      Submit Registration
                    </>
                  )}
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Help Section */}
        <div className="mt-6 bg-white rounded-2xl border border-gray-200 p-6">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-xl bg-green-50 flex items-center justify-center flex-shrink-0">
              <Info className="text-green-500" size={20} />
            </div>
            <div>
              <h3 className="text-sm font-bold text-gray-700">Need Help?</h3>
              <p className="mt-1 text-sm text-gray-500">
                You can save your progress at any step and continue later. 
                Once submitted, our admin team will review your application and verify your documents.
                You'll be notified once your account is approved.
              </p>
              <Link
                to="/help"
                className="inline-flex items-center gap-1 mt-2 text-sm font-medium text-green-600 hover:text-green-700"
              >
                Visit Help Center <ArrowRight size={14} />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default VendorRegistration;