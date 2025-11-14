// src/pages/ContactUs.jsx
import React, { useState } from "react";

/* ---------- Small inline SVG icon components ---------- */
const IconLocation = ({ className = "w-5 h-5" }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    aria-hidden
  >
    <path
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M12 11.5a2 2 0 100-4 2 2 0 000 4z"
    />
    <path
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M12 21s7-4.5 7-10A7 7 0 105 11c0 5.5 7 10 7 10z"
    />
  </svg>
);
const IconPhone = ({ className = "w-5 h-5" }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    aria-hidden
  >
    <path
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M22 16.92V21a1 1 0 01-1.1 1 19.86 19.86 0 01-8.63-3.07 19.5 19.5 0 01-6-6A19.86 19.86 0 013 3.1 1 1 0 014 2h4.09a1 1 0 01.95.68l1.1 3.3a1 1 0 01-.25 1.02L8.91 9.91a13 13 0 006 6l2.9-1.98a1 1 0 011.02-.25l3.3 1.1a1 1 0 01.68.95z"
    />
  </svg>
);
const IconMail = ({ className = "w-5 h-5" }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    aria-hidden
  >
    <path
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M3 8l9 6 9-6"
    />
    <path
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M21 8v8a2 2 0 01-2 2H5a2 2 0 01-2-2V8"
    />
  </svg>
);
const IconFacebook = ({ className = "w-5 h-5" }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="currentColor"
    aria-hidden
  >
    <path d="M22 12a10 10 0 10-11.5 9.9v-7H8.5v-2.9h2V9.1c0-2 1.2-3.1 3-3.1.9 0 1.8.16 1.8.16v2h-1c-1 0-1.3.6-1.3 1.2v1.5h2.3l-.36 2.9h-1.94V22A10 10 0 0022 12z" />
  </svg>
);
const IconTwitter = ({ className = "w-5 h-5" }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="currentColor"
    aria-hidden
  >
    <path d="M22 5.9c-.6.3-1.3.5-2 .6.7-.4 1.3-1 1.6-1.7-.6.4-1.4.7-2.2.9a3.5 3.5 0 00-6 3.2A10 10 0 013 4.7a3.5 3.5 0 001.1 4.7c-.5 0-1-.1-1.5-.4v.1A3.5 3.5 0 006.2 14a3.5 3.5 0 01-1.6.06 3.5 3.5 0 003.3 2.4A7 7 0 013 19.5a9.9 9.9 0 005.4 1.6c6.5 0 10-5.5 10-10v-.5a6.8 6.8 0 001.7-1.7 6.6 6.6 0 01-1.9.5z" />
  </svg>
);
const IconInstagram = ({ className = "w-5 h-5" }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="currentColor"
    aria-hidden
  >
    <path d="M7 2h10a5 5 0 015 5v10a5 5 0 01-5 5H7a5 5 0 01-5-5V7a5 5 0 015-5zm5 6.2A3 3 0 108 11a3 3 0 004 0zm4.8-3.1a.9.9 0 11-1.8 0 .9.9 0 011.8 0z" />
  </svg>
);

/* ------------------- ContactUs component ------------------- */
export default function ContactUs() {
  // form state (left column)
  const [form, setForm] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  const contact = {
    whatsappNumber: "918105751886",
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  // Send via WhatsApp: builds message, opens wa.me link
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!form.name || !form.email || !form.message) {
      setError("Please fill required fields (name, email, message).");
      return;
    }

    setLoading(true);

    try {
      // Build the message text with labels and line breaks
      const ending = "contact form - Proedge Learning Official Website";
      const lines = [
        `Name: ${form.name}`,
        `Email: ${form.email}`,
        `Subject: ${form.subject || "-"}`,
        `Message: ${form.message}`,
        "",
        ending,
      ];
      const message = lines.join("\n");

      // Encode and open WhatsApp click-to-chat
      const encoded = encodeURIComponent(message);
      const waUrl = `https://wa.me/${contact.whatsappNumber}?text=${encoded}`;

      // Open in new tab/window (works on mobile & desktop)
      window.open(waUrl, "_blank");

      // Optionally show success state in UI
      setSent(true);
      setForm({ name: "", email: "", subject: "", message: "" });
      setTimeout(() => setSent(false), 3000);
    } catch (err) {
      setError("Failed to open WhatsApp. Please try manually.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-neutral-900 text-gray-100">
      {/* Hero */}
      <section className="py-16">
        <div className="container mx-auto px-6 text-center">
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">
            Get In Touch
          </h1>
          <p className="mt-4 text-gray-300 max-w-2xl mx-auto">
            Ready to start your career? Contact us today and groom yourself with ProEdge Experts.
          </p>
        </div>
      </section>

      {/* Card container */}
      <section className="container mx-auto px-6 pb-20">
        <div className="bg-neutral-800 border border-neutral-700 rounded-2xl p-8 shadow-lg">
          <h2 className="text-2xl font-semibold mb-6">Send Us a Message</h2>

          {sent && (
            <div className="mb-4 p-3 rounded bg-green-700/20 text-green-200 border border-green-700">
              ✅ WhatsApp opened with your message.
            </div>
          )}

          {error && (
            <div className="mb-4 p-3 rounded bg-red-700/20 text-red-200 border border-red-700">
              ⚠️ {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <label className="block">
                <span className="text-xs text-gray-300">Your Name</span>
                <input
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  className="mt-2 w-full bg-neutral-900 border border-neutral-700 px-4 py-3 rounded-md text-gray-100 focus:outline-none focus:ring-2 focus:ring-[#7c4dff]"
                  placeholder="John Doe"
                  required
                />
              </label>

              <label className="block">
                <span className="text-xs text-gray-300">Your Email</span>
                <input
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={handleChange}
                  className="mt-2 w-full bg-neutral-900 border border-neutral-700 px-4 py-3 rounded-md text-gray-100 focus:outline-none focus:ring-2 focus:ring-[#7c4dff]"
                  placeholder="john@example.com"
                  required
                />
              </label>
            </div>

            <label className="block">
              <span className="text-xs text-gray-300">Subject</span>
              <input
                name="subject"
                value={form.subject}
                onChange={handleChange}
                className="mt-2 w-full bg-neutral-900 border border-neutral-700 px-4 py-3 rounded-md text-gray-100 focus:outline-none focus:ring-2 focus:ring-[#7c4dff]"
                placeholder="Enquiry about services,courses, etc."
              />
            </label>

            <label className="block">
              <span className="text-xs text-gray-300">Message</span>
              <textarea
                name="message"
                value={form.message}
                onChange={handleChange}
                className="mt-2 w-full min-h-[150px] resize-y bg-neutral-900 border border-neutral-700 px-4 py-3 rounded-md text-gray-100 focus:outline-none focus:ring-2 focus:ring-[#7c4dff]"
                placeholder="Tell us about your enquiry..."
                required
              />
            </label>

            <div className="flex items-center gap-4">
              <button
                type="submit"
                disabled={loading}
                className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-[#7c4dff] to-[#fca532] hover:opacity-95 text-neutral-900 font-semibold px-6 py-3 rounded-md shadow"
              >
                {loading ? "Opening WhatsApp..." : "Send Message"}
              </button>

              <button
                type="button"
                onClick={() =>
                  setForm({ name: "", email: "", subject: "", message: "" })
                }
                className="px-4 py-2 rounded-md border border-neutral-700 text-sm text-neutral-300 hover:bg-neutral-800"
              >
                Reset
              </button>
            </div>
          </form>
        </div>
      </section>
    </main>
  );
}
