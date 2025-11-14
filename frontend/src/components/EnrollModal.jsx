// src/components/EnrollModal.jsx
import React, { useState, useEffect, useRef } from "react";
import { API_BASE_URL } from "../config";

const coursesList = [
  "Basic Computer Skills",
  "Excel Basic",
  "Excel Advance",
  "Excel VBA Scripting",
  "SQL Basic",
  "SQL Advance",
  "Power BI",
  "Power Apps",
];

function CloseIcon({ className = "w-6 h-6 colo" }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden>
      <path d="M6 6L18 18M6 18L18 6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

const STORAGE_KEY = "enroll_draft_v1";

// helper to normalize phone strings to digits only for comparison
const normalizePhone = (s = "") => String(s).replace(/\D/g, "");

export default function EnrollModal({ isOpen, onClose }) {
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState({});
  const [savedMsg, setSavedMsg] = useState("");
  const saveTimer = useRef(null);
  const debouncedSaveRef = useRef(null);
  const firstInputRef = useRef(null);

  const [form, setForm] = useState({
    fullName: "",
    dob: "",
    gender: "",
    contact: "",
    email: "",
    address: "",
    educationLevel: "",
    school: "",
    board: "",
    subjects: "",
    preferredCourses: [],
    otherCourse: "",
    batchTiming: "",
    emergencyName: "",
    emergencyRelation: "",
    emergencyPhone: "",
  });

  // load draft on open
  useEffect(() => {
    if (isOpen) {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        try {
          const parsed = JSON.parse(raw);
          setForm((prev) => ({ ...prev, ...parsed }));
        } catch (err) {
          console.warn("Failed to parse saved enroll draft", err);
        }
      }
      setStep(0);
      setErrors({});
      setTimeout(() => firstInputRef.current?.focus(), 80);
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => (document.body.style.overflow = "");
  }, [isOpen]);

  // autosave draft (debounced)
  useEffect(() => {
    if (!isOpen) return;
    if (debouncedSaveRef.current) clearTimeout(debouncedSaveRef.current);
    debouncedSaveRef.current = setTimeout(() => {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(form));
        setSavedMsg("Draft saved");
        clearSavedMsgLater();
      } catch (err) {
        console.warn("Failed to save draft", err);
      }
    }, 700);

    return () => {
      if (debouncedSaveRef.current) clearTimeout(debouncedSaveRef.current);
    };
  }, [form, isOpen]);

  const clearSavedMsgLater = (ms = 1500) => {
    if (saveTimer.current) clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(() => setSavedMsg(""), ms);
  };

  useEffect(() => {
    return () => {
      if (debouncedSaveRef.current) clearTimeout(debouncedSaveRef.current);
      if (saveTimer.current) clearTimeout(saveTimer.current);
    };
  }, []);

  useEffect(() => {
    if (submitted) {
      const t = setTimeout(() => {
        onClose();
        setSubmitted(false);
      }, 1400);
      return () => clearTimeout(t);
    }
  }, [submitted, onClose]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: value }));
    setErrors((p) => ({ ...p, [name]: undefined }));

    // if user updates contact or emergencyPhone, clear cross-field error if resolved
    if (name === "contact" || name === "emergencyPhone") {
      setErrors((p) => {
        const copy = { ...p };
        if (copy.emergencyPhone && normalizePhone(name === "contact" ? value : form.contact) !== normalizePhone(name === "emergencyPhone" ? value : form.emergencyPhone)) {
          delete copy.emergencyPhone; // remove the 'same-number' error if fixed
        }
        return copy;
      });
    }
  };

  const toggleCourse = (course) => {
    setForm((prev) => {
      const exists = prev.preferredCourses.includes(course);
      return {
        ...prev,
        preferredCourses: exists ? prev.preferredCourses.filter((c) => c !== course) : [...prev.preferredCourses, course],
      };
    });
    setErrors((p) => ({ ...p, preferredCourses: undefined }));
  };

  const validateStep = (s) => {
    const e = {};
    if (s === 0) {
      if (!form.fullName.trim()) e.fullName = "Please enter full name";
      if (!form.dob) e.dob = "Date of birth required";
      if (!form.gender) e.gender = "Select gender";
      if (!form.contact.trim()) e.contact = "Contact number required";
      if (!/^\+?\d{7,15}$/.test(normalizePhone(form.contact))) e.contact = "Enter a valid phone number";
      if (!form.email.trim()) e.email = "Email required";
      if (!/^\S+@\S+\.\S+$/.test(form.email)) e.email = "Enter a valid email";
    } else if (s === 1) {
      if (!form.educationLevel) e.educationLevel = "Select education level";
      if (form.preferredCourses.length === 0 && !form.otherCourse.trim()) e.preferredCourses = "Select at least one preferred course or add other";
      if (!form.batchTiming) e.batchTiming = "Select batch preference";
    } else if (s === 2) {
      if (!form.emergencyName.trim()) e.emergencyName = "Emergency contact name required";
      if (!form.emergencyRelation.trim()) e.emergencyRelation = "Relationship required";
      if (!form.emergencyPhone.trim()) e.emergencyPhone = "Emergency phone required";
      if (!/^\+?\d{7,15}$/.test(normalizePhone(form.emergencyPhone))) e.emergencyPhone = "Enter a valid phone number";

      // NEW: ensure emergency phone is different from main contact
      const contactDigits = normalizePhone(form.contact);
      const emergencyDigits = normalizePhone(form.emergencyPhone);
      if (contactDigits && emergencyDigits && contactDigits === emergencyDigits) {
        e.emergencyPhone = "Emergency phone must be different from your contact number";
      }
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const next = () => {
    if (validateStep(step)) setStep((s) => Math.min(2, s + 1));
  };
  const back = () => setStep((s) => Math.max(0, s - 1));

  // manual save / clear
  const saveDraftNow = () => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(form));
      setSavedMsg("Draft saved");
      clearSavedMsgLater(1800);
    } catch (err) {
      console.warn("save draft failed", err);
      setSavedMsg("Save failed");
      clearSavedMsgLater(1800);
    }
  };

  const clearDraftNow = () => {
    localStorage.removeItem(STORAGE_KEY);
    setSavedMsg("Draft cleared");
    clearSavedMsgLater(1400);
  };

  const submitForm = async (e) => {
    e.preventDefault();
    if (!validateStep(2)) return;
    setLoading(true);

    const payload = {
      ...form,
      preferredCourses: form.preferredCourses.join(", "),
    };

    try {
      const res = await fetch(`${API_BASE_URL}/api/students`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (data.success) {
        setSubmitted(true);
        localStorage.removeItem(STORAGE_KEY);
        setForm({
          fullName: "",
          dob: "",
          gender: "",
          contact: "",
          email: "",
          address: "",
          educationLevel: "",
          school: "",
          board: "",
          subjects: "",
          preferredCourses: [],
          otherCourse: "",
          batchTiming: "",
          emergencyName: "",
          emergencyRelation: "",
          emergencyPhone: "",
        });
      } else {
        alert("Error: " + (data.details || data.error || "Unknown server response"));
      }
    } catch (err) {
      alert("Network error: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const progress = Math.round(((step + 1) / 3) * 100);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4" role="dialog" aria-modal="true" aria-labelledby="enroll-title">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />

      <div className="relative w-full max-w-3xl bg-white rounded-2xl shadow-2xl overflow-hidden transform transition-all">
        <div className="flex items-center justify-between px-6 py-4 border-b">
          <div>
            <h3 id="enroll-title" className="text-xl font-bold text-[#0a214d]">Student Registration</h3>
            <p className="text-sm text-gray-500">Secure your seat — fill the details below</p>
          </div>

          <div className="flex items-center gap-3">
            {savedMsg && <div className="text-sm text-green-600 px-3 py-1 rounded bg-green-50 border border-green-100">{savedMsg}</div>}
            <button onClick={onClose} aria-label="Close" className="p-2 rounded hover:bg-gray-100">
              <CloseIcon />
            </button>
          </div>
        </div>

        <div className="px-6 pt-4 pb-2">
          <div className="w-full bg-gray-200 h-2 rounded-full overflow-hidden">
            <div className="h-2 rounded-full bg-gradient-to-r from-[#7c4dff] to-[#fca532]" style={{ width: `${progress}%` }} />
          </div>
          <div className="flex items-center justify-between mt-2 text-xs text-gray-500">
            <div className="flex items-center gap-2"><span className={`px-2 py-1 rounded ${step >= 0 ? "bg-[#fca532]/20 text-[#fca532]" : "bg-gray-100 text-gray-400"}`}>1</span><span>Personal</span></div>
            <div className="flex items-center gap-2"><span className={`px-2 py-1 rounded ${step >= 1 ? "bg-[#7c4dff]/20 text-[#7c4dff]" : "bg-gray-100 text-gray-400"}`}>2</span><span>Academic</span></div>
            <div className="flex items-center gap-2"><span className={`px-2 py-1 rounded ${step >= 2 ? "bg-[#10b981]/20 text-[#10b981]" : "bg-gray-100 text-gray-400"}`}>3</span><span>Emergency</span></div>
          </div>
        </div>

        <div className="px-6 pb-6 pt-4 max-h-[70vh] overflow-y-auto">
          {submitted ? (
            <div className="flex flex-col items-center justify-center py-12">
              <div className="rounded-full p-4 bg-green-100 text-green-600">
                <svg className="w-10 h-10" viewBox="0 0 24 24" fill="none" aria-hidden>
                  <path d="M20 6L9 17l-5-5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <h4 className="mt-4 text-lg font-semibold text-gray-800">Registration Successful</h4>
              <p className="text-sm text-gray-500 mt-1">Thanks — we will contact you with next steps.</p>
            </div>
          ) : (
            <form onSubmit={submitForm} className="space-y-6">
              {/* Step 1 */}
              {step === 0 && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <label className="block">
                      <span className="text-sm text-gray-700">Full name</span>
                      <input ref={firstInputRef} name="fullName" value={form.fullName} onChange={handleChange} className={`mt-2 w-full px-4 py-3 rounded-lg border ${errors.fullName ? "border-red-400" : "border-gray-200"}`} placeholder="Jane Doe" aria-invalid={!!errors.fullName} />
                      {errors.fullName && <p className="mt-1 text-xs text-red-500">{errors.fullName}</p>}
                    </label>

                    <label className="block">
                      <span className="text-sm text-gray-700">Date of birth</span>
                      <input name="dob" type="date" value={form.dob} onChange={handleChange} className={`mt-2 w-full px-4 py-3 rounded-lg border ${errors.dob ? "border-red-400" : "border-gray-200"}`} aria-invalid={!!errors.dob} />
                      {errors.dob && <p className="mt-1 text-xs text-red-500">{errors.dob}</p>}
                    </label>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <label className="block">
                      <span className="text-sm text-gray-700">Gender</span>
                      <select name="gender" value={form.gender} onChange={handleChange} className={`mt-2 w-full px-4 py-3 rounded-lg border ${errors.gender ? "border-red-400" : "border-gray-200"}`} aria-invalid={!!errors.gender}>
                        <option value="">Select</option>
                        <option>Male</option>
                        <option>Female</option>
                        <option>Other</option>
                      </select>
                      {errors.gender && <p className="mt-1 text-xs text-red-500">{errors.gender}</p>}
                    </label>

                    <label className="block">
                      <span className="text-sm text-gray-700">Contact number</span>
                      <input name="contact" value={form.contact} onChange={handleChange} className={`mt-2 w-full px-4 py-3 rounded-lg border ${errors.contact ? "border-red-400" : "border-gray-200"}`} placeholder="+91 81234 56789" aria-invalid={!!errors.contact} />
                      {errors.contact && <p className="mt-1 text-xs text-red-500">{errors.contact}</p>}
                    </label>
                  </div>

                  <label className="block">
                    <span className="text-sm text-gray-700">Email address</span>
                    <input name="email" type="email" value={form.email} onChange={handleChange} className={`mt-2 w-full px-4 py-3 rounded-lg border ${errors.email ? "border-red-400" : "border-gray-200"}`} placeholder="you@example.com" aria-invalid={!!errors.email} />
                    {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email}</p>}
                  </label>

                  <label className="block">
                    <span className="text-sm text-gray-700">Residential address (optional)</span>
                    <textarea name="address" value={form.address} onChange={handleChange} className="mt-2 w-full px-4 py-3 rounded-lg border border-gray-200" rows={3} placeholder="Street, City, State, PIN" />
                  </label>
                </div>
              )}

              {/* Step 2 */}
              {step === 1 && (
                <div className="space-y-4">
                  <label className="block">
                    <span className="text-sm text-gray-700">Current education level</span>
                    <select name="educationLevel" value={form.educationLevel} onChange={handleChange} className={`mt-2 w-full px-4 py-3 rounded-lg border ${errors.educationLevel ? "border-red-400" : "border-gray-200"}`} aria-invalid={!!errors.educationLevel}>
                      <option value="">Select</option>
                      <option>10th Grade</option>
                      <option>12th Grade</option>
                      <option>Undergraduate</option>
                      <option>Graduate</option>
                      <option>Other</option>
                    </select>
                    {errors.educationLevel && <p className="mt-1 text-xs text-red-500">{errors.educationLevel}</p>}
                  </label>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <label className="block">
                      <span className="text-sm text-gray-700">School / College</span>
                      <input name="school" value={form.school} onChange={handleChange} className="mt-2 w-full px-4 py-3 rounded-lg border border-gray-200" placeholder="Institution name" />
                    </label>
                    <label className="block">
                      <span className="text-sm text-gray-700">Board / University</span>
                      <input name="board" value={form.board} onChange={handleChange} className="mt-2 w-full px-4 py-3 rounded-lg border border-gray-200" placeholder="Board or university" />
                    </label>
                  </div>

                  <label className="block">
                    <span className="text-sm text-gray-700">Subjects of interest (optional)</span>
                    <input name="subjects" value={form.subjects} onChange={handleChange} className="mt-2 w-full px-4 py-3 rounded-lg border border-gray-200" placeholder="e.g. Maths, Computer Science" />
                  </label>

                  <div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-700 font-medium">Preferred courses</span>
                      <span className="text-xs text-gray-400">Select multiple</span>
                    </div>

                    <div className="mt-3 grid grid-cols-2 sm:grid-cols-3 gap-2">
                      {coursesList.map((c) => {
                        const active = form.preferredCourses.includes(c);
                        return (
                          <button type="button" key={c} onClick={() => toggleCourse(c)} className={`text-sm px-3 py-2 rounded-lg border ${active ? "bg-[#fca532] text-white border-[#fca532]" : "bg-white text-gray-700 border-gray-200"}`}>
                            {c}
                          </button>
                        );
                      })}
                    </div>
                    {errors.preferredCourses && <p className="mt-2 text-xs text-red-500">{errors.preferredCourses}</p>}

                    <label className="block mt-3">
                      <span className="text-sm text-gray-700">Other course (optional)</span>
                      <input name="otherCourse" value={form.otherCourse} onChange={handleChange} className="mt-2 w-full px-4 py-3 rounded-lg border border-gray-200" placeholder="Any other course you want" />
                    </label>
                  </div>

                  <label className="block">
                    <span className="text-sm text-gray-700">Batch timing preference</span>
                    <select name="batchTiming" value={form.batchTiming} onChange={handleChange} className={`mt-2 w-full px-4 py-3 rounded-lg border ${errors.batchTiming ? "border-red-400" : "border-gray-200"}`} aria-invalid={!!errors.batchTiming}>
                      <option value="">Select</option>
                      <option>Morning</option>
                      <option>Afternoon</option>
                      <option>Evening</option>
                    </select>
                    {errors.batchTiming && <p className="mt-1 text-xs text-red-500">{errors.batchTiming}</p>}
                  </label>
                </div>
              )}

              {/* Step 3 */}
              {step === 2 && (
                <div className="space-y-4">
                  <label className="block">
                    <span className="text-sm text-gray-700">Emergency contact name</span>
                    <input name="emergencyName" value={form.emergencyName} onChange={handleChange} className={`mt-2 w-full px-4 py-3 rounded-lg border ${errors.emergencyName ? "border-red-400" : "border-gray-200"}`} placeholder="Name" aria-invalid={!!errors.emergencyName} />
                    {errors.emergencyName && <p className="mt-1 text-xs text-red-500">{errors.emergencyName}</p>}
                  </label>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <label className="block">
                      <span className="text-sm text-gray-700">Relationship</span>
                      <input name="emergencyRelation" value={form.emergencyRelation} onChange={handleChange} className={`mt-2 w-full px-4 py-3 rounded-lg border ${errors.emergencyRelation ? "border-red-400" : "border-gray-200"}`} placeholder="e.g. Parent / Sibling" aria-invalid={!!errors.emergencyRelation} />
                      {errors.emergencyRelation && <p className="mt-1 text-xs text-red-500">{errors.emergencyRelation}</p>}
                    </label>

                    <label className="block">
                      <span className="text-sm text-gray-700">Emergency phone</span>
                      <input name="emergencyPhone" value={form.emergencyPhone} onChange={handleChange} className={`mt-2 w-full px-4 py-3 rounded-lg border ${errors.emergencyPhone ? "border-red-400" : "border-gray-200"}`} placeholder="+91 9xx xxx xxxx" aria-invalid={!!errors.emergencyPhone} />
                      {errors.emergencyPhone && <p className="mt-1 text-xs text-red-500">{errors.emergencyPhone}</p>}
                    </label>
                  </div>

                  <div className="mt-2 p-4 border rounded-lg bg-gray-50">
                    <h4 className="text-sm font-semibold text-gray-700">Review</h4>
                    <div className="mt-2 text-sm text-gray-600 grid grid-cols-1 sm:grid-cols-2 gap-2">
                      <div><strong>Full name:</strong> {form.fullName || "—"}</div>
                      <div><strong>DOB:</strong> {form.dob || "—"}</div>
                      <div><strong>Email:</strong> {form.email || "—"}</div>
                      <div><strong>Contact:</strong> {form.contact || "—"}</div>
                      <div className="sm:col-span-2"><strong>Courses:</strong> {form.preferredCourses.length ? form.preferredCourses.join(", ") : form.otherCourse || "—"}</div>
                      <div><strong>Batch:</strong> {form.batchTiming || "—"}</div>
                      <div><strong>Emergency:</strong> {form.emergencyName ? `${form.emergencyName} (${form.emergencyRelation}) - ${form.emergencyPhone}` : "—"}</div>
                    </div>
                  </div>
                </div>
              )}

              {/* Controls */}
              <div className="flex items-center justify-between pt-2">
                <div className="flex items-center gap-2">
                  <button type="button" onClick={saveDraftNow} className="px-3 py-2 rounded-md border text-sm text-gray-700 hover:bg-gray-50">Save Draft</button>
                  <button type="button" onClick={clearDraftNow} className="px-3 py-2 rounded-md border text-sm text-red-600 hover:bg-red-50">Clear Draft</button>
                  {step > 0 && <button type="button" onClick={back} className="px-4 py-2 rounded-md border text-sm text-gray-700 hover:bg-gray-50">← Back</button>}
                </div>

                <div className="flex items-center gap-3">
                  {step < 2 ? (
                    <button type="button" onClick={next} className="px-5 py-2 rounded-md bg-[#0a214d] text-white font-medium hover:opacity-95">Continue →</button>
                  ) : (
                    <button type="submit" disabled={loading} className="px-5 py-2 rounded-md bg-gradient-to-r from-[#7c4dff] to-[#fca532] text-white font-medium shadow">
                      {loading ? "Submitting..." : "Submit Registration"}
                    </button>
                  )}
                </div>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
