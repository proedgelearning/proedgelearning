import React, { useState } from "react";

export default function EnrollModal({ isOpen, onClose }) {
  const [submitted, setSubmitted] = useState(false);

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

  const courses = [
    "Basic Computer Skills",
    "Excel Basic",
    "Excel Advance",
    "Excel VBA Scripting",
    "SQL Basic",
    "SQL Advance",
    "Power BI",
    "Power Apps",
  ];

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const toggleCourse = (course) => {
    setForm((prev) => {
      const exists = prev.preferredCourses.includes(course);
      return {
        ...prev,
        preferredCourses: exists
          ? prev.preferredCourses.filter((c) => c !== course)
          : [...prev.preferredCourses, course],
      };
    });
  };

  const submitForm = (e) => {
    e.preventDefault();
    setSubmitted(true);

    // Reset form
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

    setTimeout(() => {
      setSubmitted(false);
      onClose();
    }, 1500);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-[100] p-4 overflow-auto">
      <div className="bg-white w-full max-w-2xl rounded-xl shadow-2xl p-6 relative max-h-[90vh] overflow-y-auto">

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-600 hover:text-red-600 text-2xl"
        >
          &times;
        </button>

        <h2 className="text-3xl font-bold text-[#0a214d] mb-4 text-center">
          Student Registration
        </h2>

        {submitted ? (
          <p className="text-green-600 text-center text-lg font-semibold py-4">
            ✅ Form Submitted Successfully!
          </p>
        ) : (
          <form onSubmit={submitForm} className="space-y-4">

            {/* Section 1 */}
            <h3 className="font-bold text-lg">Section 1: Personal Details</h3>

            <input name="fullName" required placeholder="Full Name"
              className="w-full p-3 border rounded" onChange={handleChange} />

            <input type="date" name="dob" required
              className="w-full p-3 border rounded" onChange={handleChange} />

            <select name="gender" required className="w-full p-3 border rounded" onChange={handleChange}>
              <option value="">Select Gender</option>
              <option>Male</option>
              <option>Female</option>
              <option>Other</option>
            </select>

            <input name="contact" placeholder="Contact Number" required
              className="w-full p-3 border rounded" onChange={handleChange} />

            <input name="email" type="email" placeholder="Email Address" required
              className="w-full p-3 border rounded" onChange={handleChange} />

            <textarea name="address" placeholder="Residential Address"
              className="w-full p-3 border rounded" onChange={handleChange}></textarea>

            {/* Section 2 */}
            <h3 className="font-bold text-lg">Section 2: Academic Background</h3>

            <select name="educationLevel" required className="w-full p-3 border rounded" onChange={handleChange}>
              <option value="">Current Education Level</option>
              <option>10th Grade</option>
              <option>12th Grade</option>
              <option>Undergraduate</option>
              <option>Graduate</option>
              <option>Other</option>
            </select>

            <input name="school" placeholder="School / College Name"
              className="w-full p-3 border rounded" onChange={handleChange} />

            <input name="board" placeholder="Board / University"
              className="w-full p-3 border rounded" onChange={handleChange} />

            <input name="subjects" placeholder="Subjects of Interest"
              className="w-full p-3 border rounded" onChange={handleChange} />

            {/* Section 3 - Courses */}
            <h3 className="font-bold text-lg">Preferred Courses</h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {courses.map((c) => (
                <label key={c} className="text-sm">
                  <input type="checkbox" onChange={() => toggleCourse(c)} /> {c}
                </label>
              ))}
            </div>

            <input name="otherCourse" placeholder="Other Course (Optional)"
              className="w-full p-3 border rounded" onChange={handleChange} />

            {/* Batch Timing */}
            <select name="batchTiming" required className="w-full p-3 border rounded" onChange={handleChange}>
              <option value="">Batch Timing Preference</option>
              <option>Morning</option>
              <option>Afternoon</option>
              <option>Evening</option>
            </select>

            {/* Section 4 */}
            <h3 className="font-bold text-lg">Section 4: Emergency Contact</h3>

            <input name="emergencyName" placeholder="Emergency Contact Name" required
              className="w-full p-3 border rounded" onChange={handleChange} />

            <input name="emergencyRelation" placeholder="Relationship" required
              className="w-full p-3 border rounded" onChange={handleChange} />

            <input name="emergencyPhone" placeholder="Emergency Contact Number" required
              className="w-full p-3 border rounded" onChange={handleChange} />

            {/* Submit */}
            <button type="submit"
              className="w-full bg-[#fca532] text-white py-3 rounded-lg font-semibold hover:bg-orange-500 transition">
              Submit
            </button>

          </form>
        )}
      </div>
    </div>
  );
}
