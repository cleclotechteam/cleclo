"use client";

import React, { useState } from "react";
import {
  Plus,
  Trash2,
  CheckCircle2,
  AlertCircle,
  ShieldCheck,
  Building2,
  Check,
  FileCheck,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export const INDIAN_STATES = [
  "Andaman and Nicobar Islands",
  "Andhra Pradesh",
  "Arunachal Pradesh",
  "Assam",
  "Bihar",
  "Chandigarh",
  "Chhattisgarh",
  "Dadra and Nagar Haveli and Daman and Diu",
  "Delhi",
  "Goa",
  "Gujarat",
  "Haryana",
  "Himachal Pradesh",
  "Jammu and Kashmir",
  "Jharkhand",
  "Karnataka",
  "Kerala",
  "Ladakh",
  "Lakshadweep",
  "Madhya Pradesh",
  "Maharashtra",
  "Manipur",
  "Meghalaya",
  "Mizoram",
  "Nagaland",
  "Odisha",
  "Puducherry",
  "Punjab",
  "Rajasthan",
  "Sikkim",
  "Tamil Nadu",
  "Telangana",
  "Tripura",
  "Uttar Pradesh",
  "Uttarakhand",
  "West Bengal",
];

const IFSC_BANK_MAP: Record<string, string> = {
  SBIN: "State Bank of India",
  HDFC: "HDFC Bank",
  ICIC: "ICICI Bank",
  UTIB: "Axis Bank",
  PUNB: "Punjab National Bank",
  BARB: "Bank of Baroda",
  KKBK: "Kotak Mahindra Bank",
  CNRB: "Canara Bank",
  UBIN: "Union Bank of India",
  YESB: "Yes Bank",
  IDFB: "IDFC FIRST Bank",
  INDB: "IndusInd Bank",
  BKID: "Bank of India",
  CBIN: "Central Bank of India",
  IDIB: "Indian Bank",
  IOBA: "Indian Overseas Bank",
  MAHB: "Bank of Maharashtra",
  PSIB: "Punjab & Sind Bank",
  UCOB: "UCO Bank",
  UCBA: "UCO Bank",
  FDRL: "Federal Bank",
  KVBL: "Karur Vysya Bank",
  RBLN: "RBL Bank",
  SCBL: "Standard Chartered Bank",
  CITI: "Citibank",
  HSBC: "HSBC Bank",
  AUBL: "AU Small Finance Bank",
  ESFB: "Equitas Small Finance Bank",
  JSFB: "Jana Small Finance Bank",
  BAND: "Bandhan Bank",
  CSBK: "CSB Bank",
  DLXB: "Dhanlaxmi Bank",
  SIBL: "South Indian Bank",
  TMBL: "Tamilnad Mercantile Bank",
};

const STEPS = [
  {
    id: 1,
    title: "Account Details",
    description:
      "Provide your primary business and login information to set up your vendor account.",
  },
  {
    id: 2,
    title: "Business Setup",
    description: "Services, outlets & location",
  },
  {
    id: 3,
    title: "Payment & Capacity Details",
    description:
      "Provide your processing capacity and bank details for order allocation and weekly payouts.",
  },
  {
    id: 4,
    title: "Verification Documents",
    description:
      "Upload required identity and business registration documents for account verification.",
  },
  { id: 5, title: "Confirm", description: "Review & submit application" },
];

export type Outlet = {
  id: string;
  name: string;
  city: string;
  address: string;
  state: string;
  pincode: string;
  openingTime: string;
  closingTime: string;
};

export function VendorSignupForm() {
  const [currentStep, setCurrentStep] = useState(1);

  // Step 1 Form State
  const [businessName, setBusinessName] = useState("");
  const [ownerName, setOwnerName] = useState("");
  const [mobileNumber, setMobileNumber] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [otp, setOtp] = useState("");
  const [isVerified, setIsVerified] = useState(false);

  // Step 2 Form State
  const [gstRegistered, setGstRegistered] = useState("No");
  const [gstNumber, setGstNumber] = useState("");
  const [businessType, setBusinessType] = useState("Sole Proprietorship");
  const [services, setServices] = useState<string[]>([
    "Dry Cleaning",
    "Washing",
    "Steam Iron",
  ]);
  const [outlets, setOutlets] = useState<Outlet[]>([
    {
      id: "1",
      name: "",
      city: "",
      address: "",
      state: "",
      pincode: "",
      openingTime: "09:00",
      closingTime: "20:00",
    },
  ]);

  // Step 3 Form State
  const [capacity, setCapacity] = useState("50");
  const [accountHolderName, setAccountHolderName] = useState("");
  const [bankName, setBankName] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [confirmAccountNumber, setConfirmAccountNumber] = useState("");
  const [ifscCode, setIfscCode] = useState("");
  const [ifscLoading, setIfscLoading] = useState(false);
  const [ifscValid, setIfscValid] = useState(false);

  // Step 4 Documents State
  const [uploadedDocs, setUploadedDocs] = useState<Record<string, boolean>>({
    "Aadhaar Card": true,
    "PAN Card": true,
    "Business Registration": false,
  });

  // Step 5 Confirmation State
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [agreeSla, setAgreeSla] = useState(false);
  const [agreeAccurate, setAgreeAccurate] = useState(false);

  // Helper validation methods
  const isValidEmail = (val: string) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val.trim());
  const isValidMobile = (val: string) => /^\d{10}$/.test(val.trim());
  const isValidPassword = (val: string) => val.length >= 8;
  const isPasswordsMatching =
    password.length >= 8 && password === confirmPassword;

  // IFSC Auto Detection & Validation
  const handleIfscChange = async (val: string) => {
    const code = val.toUpperCase().trim().replace(/[^A-Z0-9]/g, "").slice(0, 11);
    setIfscCode(code);

    if (code.length === 11) {
      const prefix = code.substring(0, 4);
      if (IFSC_BANK_MAP[prefix]) {
        setBankName(IFSC_BANK_MAP[prefix]);
        setIfscValid(true);
      }

      // Live verification lookup
      setIfscLoading(true);
      try {
        const res = await fetch(`https://ifsc.razorpay.com/${code}`);
        if (res.ok) {
          const data = await res.json();
          if (data.BANK) {
            setBankName(data.BANK);
          }
          setIfscValid(true);
        } else if (IFSC_BANK_MAP[prefix]) {
          setIfscValid(true);
        } else {
          setIfscValid(false);
        }
      } catch {
        if (IFSC_BANK_MAP[prefix]) {
          setIfscValid(true);
        }
      } finally {
        setIfscLoading(false);
      }
    } else {
      setIfscValid(false);
    }
  };

  const addOutlet = () => {
    setOutlets([
      ...outlets,
      {
        id: Math.random().toString(36).substr(2, 9),
        name: "",
        city: "",
        address: "",
        state: "",
        pincode: "",
        openingTime: "09:00",
        closingTime: "20:00",
      },
    ]);
  };

  const removeOutlet = (id: string) => {
    if (outlets.length > 1) {
      setOutlets(outlets.filter((outlet) => outlet.id !== id));
    }
  };

  const updateOutlet = (id: string, field: keyof Outlet, value: string) => {
    setOutlets((prev) =>
      prev.map((outlet) =>
        outlet.id === id ? { ...outlet, [field]: value } : outlet,
      ),
    );
  };

  const handlePincodeChange = async (id: string, value: string) => {
    const cleaned = value.replace(/\D/g, "").slice(0, 6);
    updateOutlet(id, "pincode", cleaned);

    if (cleaned.length === 6) {
      try {
        const response = await fetch(
          `https://api.postalpincode.in/pincode/${cleaned}`,
        );
        const data = await response.json();

        if (data[0]?.Status === "Success" && data[0]?.PostOffice?.length > 0) {
          const { District, State } = data[0].PostOffice[0];
          updateOutlet(id, "city", District);
          // Match state in list
          const matchedState = INDIAN_STATES.find(
            (s) => s.toLowerCase() === State.toLowerCase(),
          );
          if (matchedState) {
            updateOutlet(id, "state", matchedState);
          } else {
            updateOutlet(id, "state", State);
          }
        }
      } catch (error) {
        console.error("Error fetching pincode details:", error);
      }
    }
  };

  const toggleService = (srv: string) => {
    setServices((prev) =>
      prev.includes(srv) ? prev.filter((s) => s !== srv) : [...prev, srv],
    );
  };

  const handleVerifyOtp = () => {
    if (otp === "1234" || otp.length === 4) {
      setIsVerified(true);
      setShowOtpModal(false);
      setOtp("");
    } else {
      alert("Invalid OTP. Use demo code: 1234");
    }
  };

  // Step Validation Status Checks for Disabling "Save & Proceed"
  const isStep1Valid = Boolean(
    businessName.trim() &&
      ownerName.trim() &&
      isValidMobile(mobileNumber) &&
      isVerified &&
      isValidEmail(email) &&
      isValidPassword(password) &&
      isPasswordsMatching,
  );

  const isStep2Valid = Boolean(
    (gstRegistered !== "Yes" || gstNumber.trim().length >= 10) &&
      services.length > 0 &&
      outlets.length > 0 &&
      outlets.every(
        (o) =>
          o.name.trim() &&
          o.address.trim() &&
          o.state.trim() &&
          o.city.trim() &&
          o.pincode.trim().length === 6 &&
          o.openingTime &&
          o.closingTime,
      ),
  );

  const isStep3Valid = Boolean(
    Number(capacity) > 0 &&
      accountHolderName.trim() &&
      bankName.trim() &&
      accountNumber.trim().length >= 8 &&
      accountNumber === confirmAccountNumber &&
      ifscCode.trim().length === 11,
  );

  const isStep4Valid = true; // Documents optional or pre-uploaded in onboarding demo

  const isStep5Valid = agreeTerms && agreeSla && agreeAccurate;

  const isCurrentStepValid = () => {
    switch (currentStep) {
      case 1:
        return isStep1Valid;
      case 2:
        return isStep2Valid;
      case 3:
        return isStep3Valid;
      case 4:
        return isStep4Valid;
      case 5:
        return isStep5Valid;
      default:
        return true;
    }
  };

  const handleNext = () => {
    if (currentStep < STEPS.length && isCurrentStepValid()) {
      setCurrentStep(currentStep + 1);
      window.scrollTo(0, 0);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      window.scrollTo(0, 0);
    }
  };

  return (
    <div
      className="w-full max-w-5xl mx-auto p-6 sm:p-10 bg-white rounded-3xl border border-[var(--line)] shadow-xl relative z-10"
      style={{ boxShadow: "0 24px 48px -20px rgba(14,51,49,0.18)" }}
    >
      <div className="w-full">
        {/* Step Progress Header */}
        <div className="mb-12">
          <div className="flex items-center justify-between">
            {STEPS.map((step, index) => (
              <div
                key={step.id}
                className={`flex items-start group ${
                  index === STEPS.length - 1 ? "flex-none" : "flex-1"
                }`}
              >
                {/* Step Circle */}
                <div className="flex flex-col items-center">
                  <div
                    className={`w-11 h-11 rounded-full flex items-center justify-center font-semibold text-sm transition-all duration-300 relative z-10 ${
                      step.id < currentStep
                        ? "bg-[var(--stamp)] text-white shadow-md"
                        : step.id === currentStep
                          ? "bg-[var(--pine)] text-white ring-2 ring-[var(--pine)] ring-offset-4 font-bold shadow-lg shadow-[var(--pine)]/20"
                          : "bg-[var(--steam-dim)] text-[var(--ink-soft)]"
                    }`}
                  >
                    {step.id < currentStep ? (
                      <Check className="w-5 h-5 stroke-[2.5]" />
                    ) : (
                      step.id
                    )}
                  </div>
                  <p
                    className={`text-xs font-semibold mt-3 text-center w-20 transition-colors duration-300 ${
                      step.id <= currentStep
                        ? "text-[var(--pine)]"
                        : "text-[var(--ink-soft)]"
                    }`}
                  >
                    {step.title}
                  </p>
                </div>

                {/* Connector Line */}
                {index < STEPS.length - 1 && (
                  <div
                    className={`h-1 flex-1 mx-2 mt-[20px] transition-all duration-300 ${
                      step.id < currentStep
                        ? "bg-[var(--pine)] shadow-sm"
                        : "bg-[var(--line)]"
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="p-0">
          {/* Header Section */}
          <div className="mb-10">
            <h2 className="text-3xl sm:text-4xl font-bold text-[var(--pine)] tracking-tight">
              {STEPS[currentStep - 1].title}
            </h2>
            <p className="text-[var(--ink-soft)] mt-2 text-base font-medium">
              {STEPS[currentStep - 1].description}
            </p>
          </div>

          <div className="space-y-8">
            {/* ── STEP 1: ACCOUNT DETAILS ── */}
            {currentStep === 1 && (
              <div className="space-y-7">
                <div className="grid sm:grid-cols-2 gap-6">
                  {/* Business Name */}
                  <div className="group">
                    <div className="flex items-center justify-between mb-2">
                      <label className="block text-sm font-semibold text-slate-900">
                        Business Name <span className="text-red-500">*</span>
                      </label>
                      {businessName.trim() && (
                        <span className="text-xs text-emerald-600 flex items-center gap-1 font-medium">
                          <CheckCircle2 className="w-3.5 h-3.5" /> Valid
                        </span>
                      )}
                    </div>
                    <input
                      type="text"
                      required
                      value={businessName}
                      onChange={(e) => setBusinessName(e.target.value)}
                      placeholder="Registered Business Name (As per Legal Documents)"
                      className={`w-full px-5 py-3 rounded-xl border-2 ${
                        businessName.trim()
                          ? "border-emerald-500 bg-emerald-50/10"
                          : "border-slate-200 bg-slate-50"
                      } text-slate-900 placeholder-slate-400 font-medium transition-all duration-200 focus:bg-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20`}
                    />
                  </div>

                  {/* Owner Name */}
                  <div className="group">
                    <div className="flex items-center justify-between mb-2">
                      <label className="block text-sm font-semibold text-slate-900">
                        Owner Name <span className="text-red-500">*</span>
                      </label>
                      {ownerName.trim() && (
                        <span className="text-xs text-emerald-600 flex items-center gap-1 font-medium">
                          <CheckCircle2 className="w-3.5 h-3.5" /> Valid
                        </span>
                      )}
                    </div>
                    <input
                      type="text"
                      required
                      value={ownerName}
                      onChange={(e) => setOwnerName(e.target.value)}
                      placeholder="Full Name of Authorized Signatory"
                      className={`w-full px-5 py-3 rounded-xl border-2 ${
                        ownerName.trim()
                          ? "border-emerald-500 bg-emerald-50/10"
                          : "border-slate-200 bg-slate-50"
                      } text-slate-900 placeholder-slate-400 font-medium transition-all duration-200 focus:bg-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20`}
                    />
                  </div>
                </div>

                {/* Mobile & OTP */}
                <div className="space-y-6">
                  <div className="group">
                    <div className="flex items-center justify-between mb-2">
                      <label className="block text-sm font-semibold text-slate-900">
                        Mobile Number <span className="text-red-500">*</span>
                      </label>
                      {isVerified ? (
                        <span className="text-xs text-emerald-600 flex items-center gap-1 font-bold">
                          <CheckCircle2 className="w-3.5 h-3.5" /> Verified
                        </span>
                      ) : (
                        <span className="text-xs text-amber-600 font-medium">
                          OTP Verification Required
                        </span>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <input
                        type="tel"
                        value={mobileNumber}
                        maxLength={10}
                        onChange={(e) => {
                          setMobileNumber(e.target.value.replace(/\D/g, ""));
                          if (isVerified) setIsVerified(false);
                        }}
                        placeholder="10-digit mobile number"
                        className={`w-full px-5 py-3 rounded-xl border-2 ${
                          isVerified
                            ? "border-emerald-500 bg-emerald-50/10"
                            : "border-slate-200 bg-slate-50"
                        } text-slate-900 placeholder-slate-400 font-medium transition-all duration-200 focus:bg-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20`}
                      />
                      {!isVerified ? (
                        <button
                          type="button"
                          onClick={() => setShowOtpModal(true)}
                          disabled={!isValidMobile(mobileNumber)}
                          className="px-6 py-3 bg-[var(--pine)] text-white font-semibold rounded-xl hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed whitespace-nowrap transition-all duration-200 text-sm shadow-md"
                        >
                          Verify Number
                        </button>
                      ) : (
                        <div className="px-6 py-3 bg-emerald-100 text-emerald-700 font-semibold rounded-xl flex items-center gap-2 border-2 border-emerald-200 whitespace-nowrap">
                          <CheckCircle2 className="w-5 h-5" />
                          <span>Verified</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Email */}
                  <div className="group">
                    <div className="flex items-center justify-between mb-2">
                      <label className="block text-sm font-semibold text-slate-900">
                        Email Address <span className="text-red-500">*</span>
                      </label>
                      {email && (
                        <span
                          className={`text-xs flex items-center gap-1 font-medium ${
                            isValidEmail(email)
                              ? "text-emerald-600"
                              : "text-red-500"
                          }`}
                        >
                          {isValidEmail(email) ? (
                            <>
                              <CheckCircle2 className="w-3.5 h-3.5" /> Valid
                              Email
                            </>
                          ) : (
                            <>
                              <AlertCircle className="w-3.5 h-3.5" /> Invalid
                              format
                            </>
                          )}
                        </span>
                      )}
                    </div>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="vendor@company.com"
                      className={`w-full px-5 py-3 rounded-xl border-2 ${
                        email
                          ? isValidEmail(email)
                            ? "border-emerald-500 bg-emerald-50/10"
                            : "border-red-400 bg-red-50/20"
                          : "border-slate-200 bg-slate-50"
                      } text-slate-900 placeholder-slate-400 font-medium transition-all duration-200 focus:bg-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20`}
                    />
                    <p className="text-xs text-slate-500 font-medium mt-2 ml-1">
                      Used for account access and important notifications
                    </p>
                  </div>
                </div>

                {/* Password & Confirm */}
                <div className="grid sm:grid-cols-2 gap-6">
                  <div className="group">
                    <div className="flex items-center justify-between mb-2">
                      <label className="block text-sm font-semibold text-slate-900">
                        Password <span className="text-red-500">*</span>
                      </label>
                      {password && (
                        <span
                          className={`text-xs flex items-center gap-1 font-medium ${
                            isValidPassword(password)
                              ? "text-emerald-600"
                              : "text-amber-600"
                          }`}
                        >
                          {isValidPassword(password) ? (
                            <>
                              <CheckCircle2 className="w-3.5 h-3.5" /> ≥8 chars
                            </>
                          ) : (
                            "Min 8 chars required"
                          )}
                        </span>
                      )}
                    </div>
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Minimum 8 characters"
                      className={`w-full px-5 py-3 rounded-xl border-2 ${
                        password
                          ? isValidPassword(password)
                            ? "border-emerald-500 bg-emerald-50/10"
                            : "border-amber-400 bg-amber-50/20"
                          : "border-slate-200 bg-slate-50"
                      } text-slate-900 placeholder-slate-400 font-medium transition-all duration-200 focus:bg-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20`}
                    />
                  </div>

                  <div className="group">
                    <div className="flex items-center justify-between mb-2">
                      <label className="block text-sm font-semibold text-slate-900">
                        Confirm Password <span className="text-red-500">*</span>
                      </label>
                      {confirmPassword && (
                        <span
                          className={`text-xs flex items-center gap-1 font-medium ${
                            isPasswordsMatching
                              ? "text-emerald-600"
                              : "text-red-500"
                          }`}
                        >
                          {isPasswordsMatching ? (
                            <>
                              <CheckCircle2 className="w-3.5 h-3.5" /> Passwords
                              Match
                            </>
                          ) : (
                            <>
                              <AlertCircle className="w-3.5 h-3.5" /> Passwords
                              do not match
                            </>
                          )}
                        </span>
                      )}
                    </div>
                    <input
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Re-enter password"
                      className={`w-full px-5 py-3 rounded-xl border-2 ${
                        confirmPassword
                          ? isPasswordsMatching
                            ? "border-emerald-500 bg-emerald-50/10"
                            : "border-red-400 bg-red-50/20"
                          : "border-slate-200 bg-slate-50"
                      } text-slate-900 placeholder-slate-400 font-medium transition-all duration-200 focus:bg-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20`}
                    />
                  </div>
                </div>
              </div>
            )}

            {/* ── STEP 2: BUSINESS SETUP ── */}
            {currentStep === 2 && (
              <div className="space-y-7">
                <div className="grid sm:grid-cols-2 gap-6">
                  <div className="group">
                    <label className="block text-sm font-semibold text-slate-900 mb-2">
                      GST Registered? <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={gstRegistered}
                      onChange={(e) => setGstRegistered(e.target.value)}
                      className="w-full px-5 py-3 rounded-xl border-2 border-slate-200 bg-slate-50 text-slate-900 font-medium transition-all duration-200 focus:bg-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
                    >
                      <option value="No">No</option>
                      <option value="Yes">Yes</option>
                    </select>
                  </div>

                  {gstRegistered === "Yes" && (
                    <div className="group">
                      <div className="flex items-center justify-between mb-2">
                        <label className="block text-sm font-semibold text-slate-900">
                          GST Number <span className="text-red-500">*</span>
                        </label>
                        {gstNumber.trim().length >= 15 && (
                          <span className="text-xs text-emerald-600 flex items-center gap-1 font-medium">
                            <CheckCircle2 className="w-3.5 h-3.5" /> Valid GSTIN
                          </span>
                        )}
                      </div>
                      <input
                        type="text"
                        value={gstNumber}
                        maxLength={15}
                        onChange={(e) =>
                          setGstNumber(e.target.value.toUpperCase())
                        }
                        placeholder="Enter 15-digit GSTIN"
                        className="w-full px-5 py-3 rounded-xl border-2 border-slate-200 bg-slate-50 text-slate-900 placeholder-slate-400 font-medium uppercase transition-all duration-200 focus:bg-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
                      />
                    </div>
                  )}

                  <div className="group">
                    <label className="block text-sm font-semibold text-slate-900 mb-2">
                      Business Type
                    </label>
                    <select
                      value={businessType}
                      onChange={(e) => setBusinessType(e.target.value)}
                      className="w-full px-5 py-3 rounded-xl border-2 border-slate-200 bg-slate-50 text-slate-900 font-medium transition-all duration-200 focus:bg-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
                    >
                      <option>Sole Proprietorship</option>
                      <option>Partnership Firm</option>
                      <option>Limited Liability Partnership (LLP)</option>
                      <option>Private Limited Company</option>
                      <option>One Person Company (OPC)</option>
                    </select>
                  </div>
                </div>

                {/* Services */}
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <label className="block text-sm font-semibold text-slate-900">
                      Services Offered <span className="text-red-500">*</span>
                    </label>
                    {services.length > 0 && (
                      <span className="text-xs text-emerald-600 font-medium">
                        {services.length} selected
                      </span>
                    )}
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    {[
                      "Dry Cleaning",
                      "Washing",
                      "Steam Iron",
                      "Repair & Alterations",
                    ].map((service) => {
                      const isSelected = services.includes(service);
                      return (
                        <div
                          key={service}
                          onClick={() => toggleService(service)}
                          className={`flex items-center gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all duration-200 ${
                            isSelected
                              ? "border-emerald-500 bg-emerald-50/40 text-emerald-900 shadow-sm"
                              : "border-slate-200 bg-slate-50 text-slate-700 hover:border-slate-300"
                          }`}
                        >
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => {}}
                            className="w-5 h-5 rounded-md text-emerald-600 focus:ring-emerald-500 shrink-0"
                          />
                          <span className="text-sm font-semibold">
                            {service}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Outlet Details */}
                <div className="border-t-2 border-slate-200 pt-8">
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h3 className="text-lg font-bold text-slate-900">
                        Outlet Details <span className="text-red-500">*</span>
                      </h3>
                      <p className="text-xs text-slate-500 mt-0.5">
                        Configure location and timings for pickup allocation
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={addOutlet}
                      className="flex items-center gap-2 text-sm font-semibold text-emerald-600 hover:text-emerald-700 transition-colors"
                    >
                      <Plus className="w-4 h-4" />
                      Add Another Outlet
                    </button>
                  </div>

                  <div className="space-y-8">
                    {outlets.map((outlet, index) => (
                      <div
                        key={outlet.id}
                        className="relative bg-slate-50/70 p-6 rounded-2xl border-2 border-slate-200"
                      >
                        {outlets.length > 1 && (
                          <div className="absolute -top-3 -right-3">
                            <button
                              type="button"
                              onClick={() => removeOutlet(outlet.id)}
                              className="p-2 bg-white text-red-500 rounded-full shadow-md border border-slate-200 hover:bg-red-50 transition-colors"
                              title="Remove outlet"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        )}

                        <div className="mb-4 text-xs font-bold text-[var(--pine)] uppercase tracking-wider">
                          Outlet #{index + 1}
                        </div>

                        <div className="space-y-5">
                          {/* Outlet Name */}
                          <div className="group">
                            <div className="flex items-center justify-between mb-2">
                              <label className="block text-sm font-semibold text-slate-900">
                                Outlet Name{" "}
                                <span className="text-red-500">*</span>
                              </label>
                              {outlet.name.trim() && (
                                <span className="text-xs text-emerald-600 flex items-center gap-1 font-medium">
                                  <CheckCircle2 className="w-3.5 h-3.5" /> Valid
                                </span>
                              )}
                            </div>
                            <input
                              type="text"
                              required
                              value={outlet.name}
                              onChange={(e) =>
                                updateOutlet(outlet.id, "name", e.target.value)
                              }
                              placeholder="e.g. Cleclo Express - Bandra West"
                              className="w-full px-5 py-3 rounded-xl border-2 border-slate-200 bg-white text-slate-900 placeholder-slate-400 font-medium transition-all duration-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
                            />
                          </div>

                          {/* Address */}
                          <div className="group">
                            <label className="block text-sm font-semibold text-slate-900 mb-2">
                              Street Address{" "}
                              <span className="text-red-500">*</span>
                            </label>
                            <input
                              type="text"
                              required
                              value={outlet.address}
                              onChange={(e) =>
                                updateOutlet(
                                  outlet.id,
                                  "address",
                                  e.target.value,
                                )
                              }
                              placeholder="Shop / Unit number, street, landmark"
                              className="w-full px-5 py-3 rounded-xl border-2 border-slate-200 bg-white text-slate-900 placeholder-slate-400 font-medium transition-all duration-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
                            />
                          </div>

                          {/* State & City */}
                          <div className="grid sm:grid-cols-3 gap-4">
                            {/* Pincode with Auto Lookup */}
                            <div className="group">
                              <div className="flex items-center justify-between mb-2">
                                <label className="block text-sm font-semibold text-slate-900">
                                  Pincode{" "}
                                  <span className="text-red-500">*</span>
                                </label>
                                {outlet.pincode.length === 6 && (
                                  <span className="text-xs text-emerald-600 flex items-center gap-1 font-medium">
                                    <CheckCircle2 className="w-3.5 h-3.5" />
                                  </span>
                                )}
                              </div>
                              <input
                                type="text"
                                value={outlet.pincode}
                                onChange={(e) =>
                                  handlePincodeChange(outlet.id, e.target.value)
                                }
                                placeholder="6-digit PIN"
                                maxLength={6}
                                className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 bg-white text-slate-900 font-medium transition-all duration-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
                              />
                            </div>

                            {/* State Dropdown */}
                            <div className="group">
                              <label className="block text-sm font-semibold text-slate-900 mb-2">
                                State <span className="text-red-500">*</span>
                              </label>
                              <select
                                value={outlet.state}
                                onChange={(e) =>
                                  updateOutlet(
                                    outlet.id,
                                    "state",
                                    e.target.value,
                                  )
                                }
                                className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 bg-white text-slate-900 font-medium transition-all duration-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
                              >
                                <option value="">Select State</option>
                                {INDIAN_STATES.map((st) => (
                                  <option key={st} value={st}>
                                    {st}
                                  </option>
                                ))}
                              </select>
                            </div>

                            {/* City */}
                            <div className="group">
                              <label className="block text-sm font-semibold text-slate-900 mb-2">
                                City <span className="text-red-500">*</span>
                              </label>
                              <input
                                type="text"
                                required
                                value={outlet.city}
                                onChange={(e) =>
                                  updateOutlet(
                                    outlet.id,
                                    "city",
                                    e.target.value,
                                  )
                                }
                                placeholder="City name"
                                className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 bg-white text-slate-900 font-medium transition-all duration-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
                              />
                            </div>
                          </div>

                          {/* Timings */}
                          <div className="pt-2">
                            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
                              Operating Hours
                            </label>
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <span className="text-xs text-slate-500 mb-1 block">
                                  Opening Time
                                </span>
                                <input
                                  type="time"
                                  value={outlet.openingTime}
                                  onChange={(e) =>
                                    updateOutlet(
                                      outlet.id,
                                      "openingTime",
                                      e.target.value,
                                    )
                                  }
                                  className="w-full px-4 py-2.5 rounded-xl border-2 border-slate-200 bg-white text-slate-900 font-medium focus:border-emerald-500"
                                />
                              </div>
                              <div>
                                <span className="text-xs text-slate-500 mb-1 block">
                                  Closing Time
                                </span>
                                <input
                                  type="time"
                                  value={outlet.closingTime}
                                  onChange={(e) =>
                                    updateOutlet(
                                      outlet.id,
                                      "closingTime",
                                      e.target.value,
                                    )
                                  }
                                  className="w-full px-4 py-2.5 rounded-xl border-2 border-slate-200 bg-white text-slate-900 font-medium focus:border-emerald-500"
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* ── STEP 3: PAYMENT & CAPACITY ── */}
            {currentStep === 3 && (
              <div className="space-y-7">
                {/* Capacity */}
                <div className="group">
                  <div className="flex items-center justify-between mb-2">
                    <label className="block text-sm font-semibold text-slate-900">
                      Daily Processing Capacity (Units / Day){" "}
                      <span className="text-red-500">*</span>
                    </label>
                    {Number(capacity) > 0 && (
                      <span className="text-xs text-emerald-600 flex items-center gap-1 font-medium">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Valid
                      </span>
                    )}
                  </div>
                  <input
                    type="number"
                    min="1"
                    value={capacity}
                    onChange={(e) => setCapacity(e.target.value)}
                    placeholder="e.g. 50"
                    className="w-full px-5 py-3 rounded-xl border-2 border-slate-200 bg-slate-50 text-slate-900 font-medium transition-all duration-200 focus:bg-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
                  />
                  <p className="text-xs text-slate-500 font-medium mt-2">
                    Used to allocate orders based on your operational capacity.
                  </p>
                </div>

                {/* Bank Details */}
                <div className="border-t-2 border-slate-200 pt-8">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                      <Building2 className="w-5 h-5 text-emerald-600" />
                      Bank Account Details for Payouts
                    </h3>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-6">
                    {/* IFSC Code with Auto-detect */}
                    <div className="group sm:col-span-2">
                      <div className="flex items-center justify-between mb-2">
                        <label className="block text-sm font-semibold text-slate-900">
                          IFSC Code <span className="text-red-500">*</span>
                        </label>
                        {ifscValid && (
                          <span className="text-xs text-emerald-600 flex items-center gap-1 font-bold">
                            <CheckCircle2 className="w-4 h-4" /> Bank Detected:{" "}
                            {bankName}
                          </span>
                        )}
                        {ifscLoading && (
                          <span className="text-xs text-slate-500 animate-pulse">
                            Detecting Bank Details...
                          </span>
                        )}
                      </div>
                      <div className="relative">
                        <input
                          type="text"
                          required
                          maxLength={11}
                          value={ifscCode}
                          onChange={(e) => handleIfscChange(e.target.value)}
                          placeholder="e.g. SBIN0001234 or HDFC0000001"
                          className={`w-full px-5 py-3 uppercase rounded-xl border-2 ${
                            ifscValid
                              ? "border-emerald-500 bg-emerald-50/10"
                              : "border-slate-200 bg-slate-50"
                          } text-slate-900 font-mono font-bold tracking-wider transition-all duration-200 focus:bg-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20`}
                        />
                        {ifscValid && (
                          <div className="absolute right-4 top-1/2 -translate-y-1/2 text-emerald-600">
                            <CheckCircle2 className="w-5 h-5" />
                          </div>
                        )}
                      </div>
                      <p className="text-xs text-slate-500 mt-1.5 ml-1">
                        Enter 11-character IFSC code to automatically detect your bank.
                      </p>
                    </div>

                    {/* Auto-detected Bank Name */}
                    <div className="group">
                      <div className="flex items-center justify-between mb-2">
                        <label className="block text-sm font-semibold text-slate-900">
                          Bank Name <span className="text-red-500">*</span>
                        </label>
                        {bankName.trim() && (
                          <span className="text-xs text-emerald-600 flex items-center gap-1 font-medium">
                            <CheckCircle2 className="w-3.5 h-3.5" /> Auto-filled
                          </span>
                        )}
                      </div>
                      <input
                        type="text"
                        required
                        value={bankName}
                        onChange={(e) => setBankName(e.target.value)}
                        placeholder="Bank Name (Auto-detected via IFSC)"
                        className="w-full px-5 py-3 rounded-xl border-2 border-slate-200 bg-slate-50 text-slate-900 font-medium transition-all duration-200 focus:bg-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
                      />
                    </div>

                    {/* Account Holder Name */}
                    <div className="group">
                      <div className="flex items-center justify-between mb-2">
                        <label className="block text-sm font-semibold text-slate-900">
                          Account Holder Name{" "}
                          <span className="text-red-500">*</span>
                        </label>
                        {accountHolderName.trim() && (
                          <span className="text-xs text-emerald-600 flex items-center gap-1 font-medium">
                            <CheckCircle2 className="w-3.5 h-3.5" /> Valid
                          </span>
                        )}
                      </div>
                      <input
                        type="text"
                        required
                        value={accountHolderName}
                        onChange={(e) => setAccountHolderName(e.target.value)}
                        placeholder="Exactly as per bank records"
                        className="w-full px-5 py-3 rounded-xl border-2 border-slate-200 bg-slate-50 text-slate-900 font-medium transition-all duration-200 focus:bg-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
                      />
                    </div>

                    {/* Account Number */}
                    <div className="group">
                      <div className="flex items-center justify-between mb-2">
                        <label className="block text-sm font-semibold text-slate-900">
                          Account Number <span className="text-red-500">*</span>
                        </label>
                        {accountNumber.trim().length >= 8 && (
                          <span className="text-xs text-emerald-600 flex items-center gap-1 font-medium">
                            <CheckCircle2 className="w-3.5 h-3.5" /> Valid
                          </span>
                        )}
                      </div>
                      <input
                        type="password"
                        required
                        value={accountNumber}
                        onChange={(e) =>
                          setAccountNumber(e.target.value.replace(/\D/g, ""))
                        }
                        placeholder="Enter bank account number"
                        className="w-full px-5 py-3 rounded-xl border-2 border-slate-200 bg-slate-50 text-slate-900 font-medium transition-all duration-200 focus:bg-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
                      />
                    </div>

                    {/* Confirm Account Number */}
                    <div className="group">
                      <div className="flex items-center justify-between mb-2">
                        <label className="block text-sm font-semibold text-slate-900">
                          Confirm Account Number{" "}
                          <span className="text-red-500">*</span>
                        </label>
                        {confirmAccountNumber && (
                          <span
                            className={`text-xs flex items-center gap-1 font-medium ${
                              accountNumber === confirmAccountNumber
                                ? "text-emerald-600"
                                : "text-red-500"
                            }`}
                          >
                            {accountNumber === confirmAccountNumber ? (
                              <>
                                <CheckCircle2 className="w-3.5 h-3.5" /> Matches
                              </>
                            ) : (
                              "Numbers do not match"
                            )}
                          </span>
                        )}
                      </div>
                      <input
                        type="text"
                        required
                        value={confirmAccountNumber}
                        onChange={(e) =>
                          setConfirmAccountNumber(
                            e.target.value.replace(/\D/g, ""),
                          )
                        }
                        placeholder="Re-enter bank account number"
                        className={`w-full px-5 py-3 rounded-xl border-2 ${
                          confirmAccountNumber
                            ? accountNumber === confirmAccountNumber
                              ? "border-emerald-500 bg-emerald-50/10"
                              : "border-red-400 bg-red-50/20"
                            : "border-slate-200 bg-slate-50"
                        } text-slate-900 font-medium transition-all duration-200 focus:bg-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20`}
                      />
                    </div>
                  </div>

                  <div className="mt-8 bg-emerald-50/50 rounded-2xl p-5 border border-emerald-100">
                    <h4 className="font-bold text-slate-900 mb-2 flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      Weekly Payout Schedule
                    </h4>
                    <ul className="space-y-1.5 text-xs text-slate-600 ml-6 list-disc marker:text-emerald-500 font-medium">
                      <li>Direct bank transfer processed every Friday.</li>
                      <li>Settlements calculated for all completed orders.</li>
                      <li>Bank credits reflect within 1–2 working days.</li>
                    </ul>
                  </div>
                </div>
              </div>
            )}

            {/* ── STEP 4: VERIFICATION DOCUMENTS ── */}
            {currentStep === 4 && (
              <div className="space-y-8">
                <div className="grid md:grid-cols-3 gap-6">
                  {[
                    {
                      key: "Aadhaar Card",
                      title: "Aadhaar Card (Authorized Signatory)",
                      desc: "Upload clear front and back copies.",
                    },
                    {
                      key: "PAN Card",
                      title: "PAN Card (Business / Proprietor PAN)",
                      desc: "Upload a clear scanned copy.",
                    },
                    {
                      key: "Business Registration",
                      title: "Business Registration Certificate",
                      desc: "Udyam / Shop Act / Incorporation",
                    },
                    {
                      key: "GST Certificate",
                      title: "GST Registration Certificate",
                      desc: "Required only if GST registered.",
                    },
                    {
                      key: "Cancelled Cheque",
                      title: "Cancelled Cheque / Bank Statement",
                      desc: "For automated payout verification.",
                    },
                  ].map((doc) => {
                    const isUploaded = uploadedDocs[doc.key];
                    return (
                      <div
                        key={doc.key}
                        className={`border-2 rounded-2xl p-6 text-center transition-all duration-200 ${
                          isUploaded
                            ? "border-emerald-500 bg-emerald-50/20"
                            : "border-dashed border-slate-300 hover:border-emerald-400 bg-white"
                        }`}
                      >
                        <div
                          className={`w-12 h-12 mx-auto mb-3 rounded-full flex items-center justify-center transition-colors ${
                            isUploaded
                              ? "bg-emerald-100 text-emerald-600"
                              : "bg-slate-100 text-slate-600"
                          }`}
                        >
                          {isUploaded ? (
                            <FileCheck className="w-6 h-6" />
                          ) : (
                            <ShieldCheck className="w-6 h-6" />
                          )}
                        </div>
                        <h4 className="font-bold text-slate-900 text-sm">
                          {doc.title}
                        </h4>
                        <p className="text-xs text-slate-500 mt-1 mb-4">
                          {doc.desc}
                        </p>
                        <button
                          type="button"
                          onClick={() =>
                            setUploadedDocs((prev) => ({
                              ...prev,
                              [doc.key]: !prev[doc.key],
                            }))
                          }
                          className={`px-4 py-2 text-xs font-bold rounded-lg transition-all ${
                            isUploaded
                              ? "bg-emerald-600 text-white shadow-md shadow-emerald-600/20"
                              : "bg-slate-900 text-white hover:bg-slate-800"
                          }`}
                        >
                          {isUploaded ? "Uploaded ✓" : "Upload File"}
                        </button>
                      </div>
                    );
                  })}
                </div>

                <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 text-center space-y-1">
                  <p className="text-xs font-bold text-slate-900">
                    Accepted Formats: PDF, JPG, PNG • Max 5MB per file
                  </p>
                  <p className="text-xs text-slate-500 font-medium">
                    Account verification takes 24–48 business hours after submission.
                  </p>
                </div>
              </div>
            )}

            {/* ── STEP 5: CONFIRM & SUBMIT ── */}
            {currentStep === 5 && (
              <div className="space-y-6">
                <div className="bg-linear-to-br from-slate-50 to-slate-100 rounded-2xl p-6 border-2 border-slate-200">
                  <h3 className="font-bold text-slate-900 mb-4 text-base">
                    Application Summary
                  </h3>
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between items-center py-2.5 border-b border-slate-200">
                      <span className="text-slate-600 font-medium">
                        Business Name
                      </span>
                      <span className="font-bold text-slate-900">
                        {businessName || "Sample Laundry"}
                      </span>
                    </div>
                    <div className="flex justify-between items-center py-2.5 border-b border-slate-200">
                      <span className="text-slate-600 font-medium">Email</span>
                      <span className="font-bold text-slate-900">
                        {email || "vendor@laundry.com"}
                      </span>
                    </div>
                    <div className="flex justify-between items-center py-2.5 border-b border-slate-200">
                      <span className="text-slate-600 font-medium">Mobile</span>
                      <span className="font-bold text-slate-900">
                        +91 {mobileNumber || "9876543210"}
                      </span>
                    </div>
                    <div className="flex justify-between items-center py-2.5 border-b border-slate-200">
                      <span className="text-slate-600 font-medium">Bank</span>
                      <span className="font-bold text-slate-900">
                        {bankName || "HDFC Bank"} ({ifscCode || "HDFC0000001"})
                      </span>
                    </div>
                    <div className="flex justify-between items-center py-2.5">
                      <span className="text-slate-600 font-medium">
                        Primary Outlet Location
                      </span>
                      <span className="font-bold text-slate-900">
                        {outlets[0]?.city || "Mumbai"},{" "}
                        {outlets[0]?.state || "Maharashtra"}
                      </span>
                    </div>
                  </div>
                </div>

                {/* 3 Terms & Conditions Checkboxes */}
                <div className="space-y-3">
                  <label
                    onClick={() => setAgreeTerms(!agreeTerms)}
                    className={`flex items-start gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all duration-200 ${
                      agreeTerms
                        ? "border-emerald-500 bg-emerald-50/30"
                        : "border-slate-200 bg-slate-50 hover:border-slate-300"
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={agreeTerms}
                      onChange={() => {}}
                      className="w-5 h-5 mt-1 rounded-md border-2 border-slate-300 text-emerald-500 focus:ring-2 focus:ring-emerald-500/20 cursor-pointer shrink-0"
                    />
                    <span className="text-sm text-slate-700 font-medium">
                      I agree to the{" "}
                      <span className="font-bold text-slate-900">
                        Terms &amp; Conditions
                      </span>{" "}
                      governing my onboarding and participation as a Cleclo Vendor.
                    </span>
                  </label>

                  <label
                    onClick={() => setAgreeSla(!agreeSla)}
                    className={`flex items-start gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all duration-200 ${
                      agreeSla
                        ? "border-emerald-500 bg-emerald-50/30"
                        : "border-slate-200 bg-slate-50 hover:border-slate-300"
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={agreeSla}
                      onChange={() => {}}
                      className="w-5 h-5 mt-1 rounded-md border-2 border-slate-300 text-emerald-500 focus:ring-2 focus:ring-emerald-500/20 cursor-pointer shrink-0"
                    />
                    <span className="text-sm text-slate-700 font-medium">
                      I agree to the{" "}
                      <span className="font-bold text-slate-900">
                        Service Level Agreement (SLA)
                      </span>{" "}
                      and the applicable{" "}
                      <span className="font-bold text-slate-900">
                        Vendor Payout Structure
                      </span>
                      .
                    </span>
                  </label>

                  <label
                    onClick={() => setAgreeAccurate(!agreeAccurate)}
                    className={`flex items-start gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all duration-200 ${
                      agreeAccurate
                        ? "border-emerald-500 bg-emerald-50/30"
                        : "border-slate-200 bg-slate-50 hover:border-slate-300"
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={agreeAccurate}
                      onChange={() => {}}
                      className="w-5 h-5 mt-1 rounded-md border-2 border-slate-300 text-emerald-500 focus:ring-2 focus:ring-emerald-500/20 cursor-pointer shrink-0"
                    />
                    <span className="text-sm text-slate-700 font-medium">
                      I confirm that all information and documents provided by me are{" "}
                      <span className="font-bold text-slate-900">
                        true, complete and accurate
                      </span>{" "}
                      and I authorize the submission of this application.
                    </span>
                  </label>
                </div>
              </div>
            )}
          </div>

          {/* Navigation Controls */}
          <div className="flex justify-between gap-4 mt-10 pt-8 border-t border-[var(--line)]">
            <button
              type="button"
              onClick={handlePrevious}
              disabled={currentStep === 1}
              className="btn btn-ghost px-6 sm:px-8 py-3.5 disabled:opacity-30 disabled:cursor-not-allowed justify-center font-semibold"
            >
              Back
            </button>
            <button
              type="button"
              onClick={handleNext}
              disabled={!isCurrentStepValid()}
              className="btn btn-primary px-6 sm:px-8 py-3.5 justify-center font-bold disabled:opacity-40 disabled:cursor-not-allowed transition-all"
            >
              {currentStep === STEPS.length
                ? "Submit Application"
                : currentStep === 3
                  ? "Save & Proceed to Documents"
                  : currentStep === 4
                    ? "Submit for Verification"
                    : "Save & Proceed"}
            </button>
          </div>
        </div>

        <div className="mt-8 text-center">
          <p className="text-xs text-slate-500 font-medium">
            🔒 Your data is secure and encrypted with 256-bit SSL.
          </p>
        </div>
      </div>

      {/* OTP Modal */}
      <Dialog open={showOtpModal} onOpenChange={setShowOtpModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold flex items-center gap-2">
              <ShieldCheck className="w-6 h-6 text-emerald-500" />
              Verify Mobile Number
            </DialogTitle>
            <DialogDescription className="text-base text-slate-600">
              We have sent an OTP code to{" "}
              <span className="font-bold text-slate-900">{mobileNumber}</span>.
              Please enter it below.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-6 py-6">
            <div className="grid gap-3">
              <Label
                htmlFor="otp"
                className="text-sm font-semibold text-slate-700"
              >
                Enter 4-Digit Verification Code
              </Label>
              <Input
                id="otp"
                value={otp}
                onChange={(e) => setOtp(e.target.value.slice(0, 4))}
                placeholder="0000"
                className="text-center text-3xl font-bold tracking-[0.5em] h-16 border-2 border-slate-200 focus:border-emerald-500 focus:ring-emerald-500/20 rounded-xl"
                maxLength={4}
              />
              <p className="text-xs text-center text-slate-500 mt-2">
                Enter code{" "}
                <span className="font-mono font-bold text-emerald-600">1234</span>{" "}
                to verify
              </p>
            </div>
          </div>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              variant="outline"
              onClick={() => setShowOtpModal(false)}
              className="rounded-xl font-semibold border-slate-200 h-12"
            >
              Cancel
            </Button>
            <Button
              onClick={handleVerifyOtp}
              disabled={otp.length !== 4}
              className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-semibold h-12 shadow-lg shadow-emerald-500/20"
            >
              Verify Code
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
