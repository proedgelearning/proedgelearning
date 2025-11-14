// src/pages/ApplicationForm.jsx
import React, { useEffect, useRef, useState } from "react";
import { API_BASE_URL } from "../config";

const STORAGE_KEY = "application_draft_v1";
const COURSES = [
  "Basic Computer Skills",
  "Excel Basic",
  "Excel Advance",
  "Excel VBA Scripting",
  "SQL Basic",
  "SQL Advance",
  "Power BI",
  "Power Apps",
];

const normalizeDigits = (s = "") => String(s).replace(/\D/g, "");

export default function ApplicationForm() {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [savedMsg, setSavedMsg] = useState("");
  const [summaryOpen, setSummaryOpen] = useState(false); // collapsed on mobile by default
  const saveTimerRef = useRef(null);
  const autosaveTimerRef = useRef(null);

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

  const [errors, setErrors] = useState({});

  // Load draft on mount
  useEffect(() => {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      try {
        const parsed = JSON.parse(raw);
        setForm((p) => ({ ...p, ...parsed }));
        setSavedMsg("Draft loaded");
        clearTimeout(saveTimerRef.current);
        saveTimerRef.current = setTimeout(() => setSavedMsg(""), 1200);
      } catch (err) {
        console.warn("Failed to parse draft", err);
      }
    }
    return () => {
      if (autosaveTimerRef.current) clearTimeout(autosaveTimerRef.current);
      if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
    };
  }, []);

  // Autosave (debounced)
  useEffect(() => {
    if (autosaveTimerRef.current) clearTimeout(autosaveTimerRef.current);
    autosaveTimerRef.current = setTimeout(() => {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(form));
        setSavedMsg("Draft saved");
        clearTimeout(saveTimerRef.current);
        saveTimerRef.current = setTimeout(() => setSavedMsg(""), 1200);
      } catch (err) {
        console.warn("autosave failed", err);
      }
    }, 700);

    return () => {
      if (autosaveTimerRef.current) clearTimeout(autosaveTimerRef.current);
    };
  }, [form]);

  // helpers
  const update = (patch) => setForm((p) => ({ ...p, ...patch }));

  const toggleCourse = (c) =>
    setForm((p) => {
      const exists = p.preferredCourses.includes(c);
      return {
        ...p,
        preferredCourses: exists ? p.preferredCourses.filter((x) => x !== c) : [...p.preferredCourses, c],
      };
    });

  const saveDraftNow = () => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(form));
      setSavedMsg("Draft saved");
      clearTimeout(saveTimerRef.current);
      saveTimerRef.current = setTimeout(() => setSavedMsg(""), 1400);
    } catch (err) {
      setSavedMsg("Save failed");
      clearTimeout(saveTimerRef.current);
      saveTimerRef.current = setTimeout(() => setSavedMsg(""), 1400);
    }
  };

  const clearDraftNow = () => {
    localStorage.removeItem(STORAGE_KEY);
    setSavedMsg("Draft cleared");
    clearTimeout(saveTimerRef.current);
    saveTimerRef.current = setTimeout(() => setSavedMsg(""), 1400);
  };

  // validation
  const validate = () => {
    const e = {};
    if (!form.fullName.trim()) e.fullName = "Full name is required";
    if (!form.dob) e.dob = "Date of birth is required";
    if (!form.gender) e.gender = "Select gender";
    if (!form.contact.trim()) e.contact = "Contact number required";
    if (!/^\d{7,15}$/.test(normalizeDigits(form.contact))) e.contact = "Enter a valid phone number";
    if (!form.email.trim()) e.email = "Email required";
    if (!/^\S+@\S+\.\S+$/.test(form.email)) e.email = "Enter a valid email";
    if (!form.educationLevel) e.educationLevel = "Education level required";
    if (form.preferredCourses.length === 0 && !form.otherCourse.trim()) e.preferredCourses = "Select at least one preferred course or add other";
    if (!form.batchTiming) e.batchTiming = "Select a batch timing";
    if (!form.emergencyName.trim()) e.emergencyName = "Emergency contact name required";
    if (!form.emergencyRelation.trim()) e.emergencyRelation = "Relationship required";
    if (!form.emergencyPhone.trim()) e.emergencyPhone = "Emergency phone required";
    if (!/^\d{7,15}$/.test(normalizeDigits(form.emergencyPhone))) e.emergencyPhone = "Enter a valid phone number";
    // emergency must differ
    if (
      normalizeDigits(form.contact) &&
      normalizeDigits(form.emergencyPhone) &&
      normalizeDigits(form.contact) === normalizeDigits(form.emergencyPhone)
    ) {
      e.emergencyPhone = "Emergency phone must be different from contact number";
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const percentageComplete = () => {
    const fields = [
      "fullName",
      "dob",
      "gender",
      "contact",
      "email",
      "educationLevel",
      "preferredCourses",
      "batchTiming",
      "emergencyName",
      "emergencyPhone",
    ];
    let filled = 0;
    fields.forEach((f) => {
      if (f === "preferredCourses") {
        if (form.preferredCourses.length || form.otherCourse.trim()) filled++;
      } else if (form[f] && String(form[f]).trim() !== "") filled++;
    });
    return Math.round((filled / fields.length) * 100);
  };

  // submit
  const submitForm = async (e) => {
    e.preventDefault();
    if (!validate()) {
      // focus first error field for mobile UX
      const firstKey = Object.keys(errors)[0];
      if (firstKey) {
        const el = document.querySelector(`[name="${firstKey}"]`);
        if (el) el.scrollIntoView({ behavior: "smooth", block: "center" });
      }
      return;
    }

    setLoading(true);
    try {
      const payload = {
        ...form,
        preferredCourses: Array.isArray(form.preferredCourses) ? form.preferredCourses.join(", ") : form.preferredCourses,
      };

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
        setErrors({});
        setSavedMsg("");
        setTimeout(() => setSubmitted(false), 2500);
      } else {
        alert("Error: " + (data.details || data.error || "Server error"));
      }
    } catch (err) {
      alert("Network error: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  // For mobile: fixed bottom bar visible only on small screens (Tailwind: md:hidden)
  const MobileActionBar = () => (
    <div className="fixed left-0 right-0 bottom-0 z-50 md:hidden bg-white/90 backdrop-blur border-t border-gray-200 p-3 flex items-center gap-3">
      <button
        onClick={saveDraftNow}
        className="flex-1 px-4 py-3 rounded-md border text-sm bg-white hover:bg-gray-50"
        aria-label="Save draft"
      >
        Save Draft
      </button>

      <button
        onClick={submitForm}
        disabled={loading}
        className="flex-1 px-4 py-3 rounded-md bg-gradient-to-r from-[#7c4dff] to-[#fca532] text-white font-semibold text-sm"
        aria-label="Submit application"
      >
        {loading ? "Submitting..." : "Submit"}
      </button>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 pb-20 md:pb-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <div className="max-w-5xl mx-auto bg-white rounded-2xl shadow-md overflow-hidden">
          {/* Mobile header */}
          <div className="md:hidden px-5 pt-6 pb-4 border-b">
            <h1 className="text-2xl font-extrabold text-[#0a214d]">Application Form</h1>
            <p className="text-sm text-gray-500 mt-1">Register for a course — quick & mobile friendly.</p>
          </div>

          <div className="md:flex">
            {/* Form area (full width on mobile) */}
            <div className="w-full md:w-2/3 p-5 sm:p-8 md:p-10">
              {/* Desktop header inside left column */}
              <div className="hidden md:flex items-start justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-[#0a214d]">Application Form</h2>
                  <p className="text-sm text-gray-500 mt-1">Fill details below to register for courses.</p>
                </div>
                <div className="text-right">
                  <div className="text-xs text-gray-500">Progress</div>
                  <div className="mt-1 w-40 bg-gray-200 h-2 rounded-full overflow-hidden">
                    <div className="h-2 bg-gradient-to-r from-[#7c4dff] to-[#fca532]" style={{ width: `${percentageComplete()}%` }} />
                  </div>
                  <div className="text-xs text-gray-400 mt-1">{percentageComplete()}% complete</div>
                </div>
              </div>

              {submitted && (
                <div className="mt-4 p-3 rounded-md bg-green-50 border border-green-100 text-green-800 text-center">
                  ✅ Application Submitted Successfully!
                </div>
              )}

              <form onSubmit={submitForm} className="mt-4 space-y-4">
                {/* Full name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700">Full Name *</label>
                  <input
                    name="fullName"
                    value={form.fullName}
                    onChange={(e) => update({ fullName: e.target.value })}
                    className={`mt-1 w-full rounded-md p-3 border ${errors.fullName ? "border-red-400" : "border-gray-200"}`}
                    placeholder="Full Name"
                    autoComplete="name"
                  />
                  {errors.fullName && <p className="text-xs text-red-500 mt-1">{errors.fullName}</p>}
                </div>

                {/* DOB and gender side-by-side on larger screens, stacked on mobile */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Date of Birth *</label>
                    <input
                      name="dob"
                      type="date"
                      value={form.dob}
                      onChange={(e) => update({ dob: e.target.value })}
                      className={`mt-1 w-full rounded-md p-3 border ${errors.dob ? "border-red-400" : "border-gray-200"}`}
                    />
                    {errors.dob && <p className="text-xs text-red-500 mt-1">{errors.dob}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">Gender *</label>
                    <select
                      name="gender"
                      value={form.gender}
                      onChange={(e) => update({ gender: e.target.value })}
                      className={`mt-1 w-full rounded-md p-3 border ${errors.gender ? "border-red-400" : "border-gray-200"}`}
                    >
                      <option value="">Select Gender</option>
                      <option>Male</option>
                      <option>Female</option>
                      <option>Other</option>
                    </select>
                    {errors.gender && <p className="text-xs text-red-500 mt-1">{errors.gender}</p>}
                  </div>
                </div>

                {/* Contact / Email */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Contact Number *</label>
                    <input
                      name="contact"
                      value={form.contact}
                      onChange={(e) => update({ contact: e.target.value })}
                      placeholder="+91 81234 56789"
                      className={`mt-1 w-full rounded-md p-3 border ${errors.contact ? "border-red-400" : "border-gray-200"}`}
                      inputMode="tel"
                    />
                    {errors.contact && <p className="text-xs text-red-500 mt-1">{errors.contact}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">Email *</label>
                    <input
                      name="email"
                      type="email"
                      value={form.email}
                      onChange={(e) => update({ email: e.target.value })}
                      placeholder="you@example.com"
                      className={`mt-1 w-full rounded-md p-3 border ${errors.email ? "border-red-400" : "border-gray-200"}`}
                      autoComplete="email"
                    />
                    {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email}</p>}
                  </div>
                </div>

                {/* Address */}
                <div>
                  <label className="block text-sm font-medium text-gray-700">Address</label>
                  <input
                    name="address"
                    value={form.address}
                    onChange={(e) => update({ address: e.target.value })}
                    placeholder="Address"
                    className="mt-1 w-full rounded-md p-3 border border-gray-200"
                  />
                </div>

                {/* Education / School / Board */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Education Level *</label>
                    <input
                      name="educationLevel"
                      value={form.educationLevel}
                      onChange={(e) => update({ educationLevel: e.target.value })}
                      placeholder="e.g. Undergraduate"
                      className={`mt-1 w-full rounded-md p-3 border ${errors.educationLevel ? "border-red-400" : "border-gray-200"}`}
                    />
                    {errors.educationLevel && <p className="text-xs text-red-500 mt-1">{errors.educationLevel}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">School / College</label>
                    <input
                      name="school"
                      value={form.school}
                      onChange={(e) => update({ school: e.target.value })}
                      placeholder="Institution"
                      className="mt-1 w-full rounded-md p-3 border border-gray-200"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">Board / University</label>
                    <input
                      name="board"
                      value={form.board}
                      onChange={(e) => update({ board: e.target.value })}
                      placeholder="Board / University"
                      className="mt-1 w-full rounded-md p-3 border border-gray-200"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Subjects (optional)</label>
                  <input
                    name="subjects"
                    value={form.subjects}
                    onChange={(e) => update({ subjects: e.target.value })}
                    placeholder="e.g. Maths, Physics"
                    className="mt-1 w-full rounded-md p-3 border border-gray-200"
                  />
                </div>

                {/* Preferred courses */}
                <div>
                  <div className="flex items-center justify-between">
                    <label className="block text-sm font-medium text-gray-700">Preferred Courses *</label>
                    <div className="text-xs text-gray-400">Tap to select</div>
                  </div>

                  <div className="mt-3 grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {COURSES.map((c) => {
                      const active = form.preferredCourses.includes(c);
                      return (
                        <button
                          key={c}
                          type="button"
                          onClick={() => toggleCourse(c)}
                          className={`px-3 py-2 rounded-md text-sm border ${active ? "bg-[#fca532] text-white border-[#fca532]" : "bg-white text-gray-700 border-gray-200"} transition`}
                        >
                          {c}
                        </button>
                      );
                    })}
                  </div>

                  <div className="mt-3">
                    <input
                      name="otherCourse"
                      value={form.otherCourse}
                      onChange={(e) => update({ otherCourse: e.target.value })}
                      placeholder="Other course (optional)"
                      className="mt-1 w-full rounded-md p-3 border border-gray-200"
                    />
                    {errors.preferredCourses && <p className="text-xs text-red-500 mt-1">{errors.preferredCourses}</p>}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Batch Timing *</label>
                    <select
                      name="batchTiming"
                      value={form.batchTiming}
                      onChange={(e) => update({ batchTiming: e.target.value })}
                      className={`mt-1 w-full rounded-md p-3 border ${errors.batchTiming ? "border-red-400" : "border-gray-200"}`}
                    >
                      <option value="">Select</option>
                      <option>Morning</option>
                      <option>Afternoon</option>
                      <option>Evening</option>
                    </select>
                    {errors.batchTiming && <p className="text-xs text-red-500 mt-1">{errors.batchTiming}</p>}
                  </div>

                  <div />
                </div>

                {/* Emergency */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Emergency Contact Name *</label>
                    <input
                      name="emergencyName"
                      value={form.emergencyName}
                      onChange={(e) => update({ emergencyName: e.target.value })}
                      placeholder="Emergency name"
                      className={`mt-1 w-full rounded-md p-3 border ${errors.emergencyName ? "border-red-400" : "border-gray-200"}`}
                    />
                    {errors.emergencyName && <p className="text-xs text-red-500 mt-1">{errors.emergencyName}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">Relation *</label>
                    <input
                      name="emergencyRelation"
                      value={form.emergencyRelation}
                      onChange={(e) => update({ emergencyRelation: e.target.value })}
                      placeholder="e.g. Parent, Sibling"
                      className={`mt-1 w-full rounded-md p-3 border ${errors.emergencyRelation ? "border-red-400" : "border-gray-200"}`}
                    />
                    {errors.emergencyRelation && <p className="text-xs text-red-500 mt-1">{errors.emergencyRelation}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">Emergency Phone *</label>
                    <input
                      name="emergencyPhone"
                      value={form.emergencyPhone}
                      onChange={(e) => update({ emergencyPhone: e.target.value })}
                      placeholder="+91 9xx xxx xxxx"
                      className={`mt-1 w-full rounded-md p-3 border ${errors.emergencyPhone ? "border-red-400" : "border-gray-200"}`}
                      inputMode="tel"
                    />
                    {errors.emergencyPhone && <p className="text-xs text-red-500 mt-1">{errors.emergencyPhone}</p>}
                  </div>
                </div>

                {/* Actions (desktop & tablet) */}
                <div className="hidden md:flex items-center justify-between gap-4 mt-4">
                  <div className="flex items-center gap-2">
                    <button type="button" onClick={saveDraftNow} className="px-4 py-2 rounded-md border bg-white hover:bg-gray-50 text-sm">Save Draft</button>
                    <button type="button" onClick={clearDraftNow} className="px-4 py-2 rounded-md border text-sm text-red-600 hover:bg-red-50">Clear Draft</button>
                    {savedMsg && <div className="text-sm text-green-600 ml-2">{savedMsg}</div>}
                  </div>

                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() =>
                        setForm({
                          fullName: "Test Student",
                          dob: "2005-01-01",
                          gender: "Male",
                          contact: "+91 8123456789",
                          email: "test@student.com",
                          address: "Sample address",
                          educationLevel: "12th Grade",
                          school: "Local School",
                          board: "State Board",
                          subjects: "Maths, Science",
                          preferredCourses: ["Excel Basic"],
                          otherCourse: "",
                          batchTiming: "Evening",
                          emergencyName: "Parent Name",
                          emergencyRelation: "Parent",
                          emergencyPhone: "+91 9876543210",
                        })
                      }
                      className="px-4 py-2 rounded-md border text-sm bg-white hover:bg-gray-50"
                    >
                      Fill demo
                    </button>

                    <button type="submit" disabled={loading} className="px-6 py-3 rounded-md bg-gradient-to-r from-[#7c4dff] to-[#fca532] text-white font-semibold">
                      {loading ? "Submitting..." : "Submit Application"}
                    </button>
                  </div>
                </div>

                {/* small footer note on mobile */}
                <div className="md:hidden text-xs text-gray-500 text-center mt-2 mb-20">We will contact you within 24 - 48 hours.</div>
              </form>
            </div>

            {/* Right column: Live Summary & Contact */}
            <aside className="w-full md:w-1/3 bg-[#f8fafc] border-t md:border-t-0 md:border-l p-4 md:p-6">
              {/* Collapsible header for mobile */}
              <div className="flex items-center justify-between md:block">
                <div className="flex items-center gap-3">
                  <h3 className="text-lg font-semibold text-[#0a214d]">Live Summary</h3>
                  <div className="hidden md:inline text-sm text-gray-500 ml-2">{percentageComplete()}% complete</div>
                </div>

                {/* toggle on mobile */}
                <button
                  type="button"
                  className="md:hidden ml-auto px-3 py-2 rounded-md border bg-white text-sm"
                  aria-expanded={summaryOpen}
                  onClick={() => setSummaryOpen((s) => !s)}
                >
                  {summaryOpen ? "Hide" : "View"}
                </button>
              </div>

              {/* content: collapsed on mobile when summaryOpen=false */}
              <div className={`mt-3 transition-all ${summaryOpen ? "max-h-[999px] opacity-100" : "max-h-0 opacity-0 overflow-hidden md:max-h-none md:opacity-100"}`}>
                <div className="space-y-3 text-sm text-gray-700">
                  <div><strong>Name:</strong> {form.fullName || "—"}</div>
                  <div><strong>DOB:</strong> {form.dob || "—"}</div>
                  <div><strong>Email:</strong> {form.email || "—"}</div>
                  <div><strong>Contact:</strong> {form.contact || "—"}</div>
                  <div><strong>Education:</strong> {form.educationLevel || "—"}</div>
                  <div><strong>Courses:</strong> {form.preferredCourses.length ? form.preferredCourses.join(", ") : (form.otherCourse || "—")}</div>
                  <div><strong>Batch:</strong> {form.batchTiming || "—"}</div>
                  <div className="mt-2"><strong>Emergency:</strong> <div className="text-sm text-gray-600">{form.emergencyName ? `${form.emergencyName} (${form.emergencyRelation}) - ${form.emergencyPhone}` : "—"}</div></div>
                </div>

                <div className="mt-5">
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Contact & Social</h4>
                  <div className="text-sm text-gray-600">Phone: <a href="tel:+918105751886" className="text-[#0a214d] hover:underline">+91 81057 51886</a></div>
                  <div className="text-sm text-gray-600 mt-1">Email: <a href="mailto:proedgelearningofficial@gmail.com" className="text-[#0a214d] hover:underline">proedgelearningofficial@gmail.com</a></div>

                  <div className="flex items-center gap-3 mt-4">
                    <a href="https://wa.me/918105751886" target="_blank" rel="noopener noreferrer" className="p-2 rounded-full bg-white border hover:bg-gray-50">
                      <svg className="w-5 h-5 text-green-600" viewBox="0 0 24 24" fill="currentColor"><path d="M20.5 3.5A11 11 0 1012 23c1.9 0 3.7-.5 5.3-1.4l3 1-1-3A10.9 10.9 0 0021 12 10.9 10.9 0 0020.5 3.5zM12 20a8 8 0 118-8 8 8 0 01-8 8z"/><path d="M17 14.1c-.3-.2-1.8-.9-2-.9s-.4-.1-.6.2-.7.9-.9 1.1c-.2.3-.4.3-.7.1-2-.9-3.6-3.5-3.9-4-.1-.2.1-.3.3-.6.1-.2.1-.4 0-.6-.1-.2-.6-1.4-.8-1.8-.2-.4-.4-.3-.6-.3-.2 0-.4 0-.6 0-.2 0-.5.1-.7.3-.4.3-1.2 1.2-1.2 3 0 1.8 1.5 3.8 1.7 4 .2.1 3 4.6 7.8 5.1 0 0 .6.1 1.2.1.6 0 1-.5 1.2-.9.2-.3 1.2-2 1.4-2.3.1-.2.1-.4.1-.6 0-.2-.2-.3-.4-.5z"/></svg>
                    </a>

                    <a href="https://www.youtube.com/@ProEdgeLearning" target="_blank" rel="noopener noreferrer" className="p-2 rounded-full bg-white border hover:bg-gray-50">
                      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor"><path d="M23.5 6.2s-.2-1.7-.8-2.4c-.8-.9-1.6-.9-2-1-2.8-.2-7-.2-7-.2s-4.2 0-7 .2c-.5 0-1.3.1-2 .9-.6.7-.8 2.4-.8 2.4S3.5 8 3.5 9.8v1.4c0 1.8.4 3.6.4 3.6s.2 1.7.8 2.4c.7.8 1.7.8 2.1.9 1.6.1 6.8.2 6.8.2s4.2 0 7-.2c.5 0 1.3-.1 2-.9.6-.7.8-2.4.8-2.4s.4-1.8.4-3.6V9.8c0-1.8-.4-3.6-.4-3.6zM9.9 14.6V8.4l5.2 3.1-5.2 3.1z"/></svg>
                    </a>

                    <a href="https://x.com/ProEdgeLearning" target="_blank" rel="noopener noreferrer" className="p-2 rounded-full bg-white border hover:bg-gray-50">
                      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor"><path d="M18.3 5.71a1 1 0 00-1.41 0L12 10.59 7.11 5.7A1 1 0 1 0 5.7 7.11L10.59 12l-4.9 4.89a1 1 0 1 0 1.41 1.41L12 13.41l4.89 4.9a1 1 0 0 0 1.41-1.41L13.41 12l4.9-4.89a1 1 0 0 0 0-1.4z"/></svg>
                    </a>

                    <a href="https://www.instagram.com/theproedgelearning/" target="_blank" rel="noopener noreferrer" className="p-2 rounded-full bg-white border hover:bg-gray-50">
                      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor"><path d="M7 2h10a5 5 0 015 5v10a5 5 0 01-5 5H7a5 5 0 01-5-5V7a5 5 0 015-5zm5 6.2A3 3 0 108 11a3 3 0 004 0zm4.8-3.1a.9.9 0 11-1.8 0 .9.9 0 011.8 0z"/></svg>
                    </a>
                  </div>

                  <div className="mt-4 text-xs text-gray-500">We will contact you within 24 - 48 hours.</div>

                  {/* desktop action area repeated at bottom of summary for convenience */}
                  <div className="hidden md:flex items-center gap-3 mt-5">
                    <button onClick={saveDraftNow} className="px-4 py-2 rounded-md border bg-white hover:bg-gray-50 text-sm">Save Draft</button>
                    <button onClick={clearDraftNow} className="px-4 py-2 rounded-md border text-sm text-red-600 hover:bg-red-50">Clear Draft</button>
                    <div className="ml-auto">
                      <button type="button" onClick={() => {
                        setForm({
                          fullName: "Test Student",
                          dob: "2005-01-01",
                          gender: "Male",
                          contact: "+91 8123456789",
                          email: "test@student.com",
                          address: "Sample address",
                          educationLevel: "12th Grade",
                          school: "Local School",
                          board: "State Board",
                          subjects: "Maths, Science",
                          preferredCourses: ["Excel Basic"],
                          otherCourse: "",
                          batchTiming: "Evening",
                          emergencyName: "Parent Name",
                          emergencyRelation: "Parent",
                          emergencyPhone: "+91 9876543210",
                        });
                      }} className="px-4 py-2 rounded-md border text-sm bg-white hover:bg-gray-50">Fill demo</button>
                    </div>
                  </div>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </div>

      {/* Mobile fixed bottom bar */}
      <div className="md:hidden">
        <MobileActionBar />
      </div>
    </div>
  );
}
