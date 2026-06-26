"use client";
import { useState } from "react";

type FormType = "enquiry" | "advertising" | "correction" | "general";

export function ContactForm({
  type = "general",
  title,
  placeholder,
  fields = ["name", "email", "message"],
  currentUrl,
}: {
  type?: FormType;
  title?: string;
  placeholder?: string;
  fields?: ("name" | "email" | "message")[];
  currentUrl?: string;
}) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("sending");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type, name, email, message, url: currentUrl ?? window.location.href }),
      });
      if (res.ok) {
        setStatus("sent");
        setName(""); setEmail(""); setMessage("");
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  }

  if (status === "sent") {
    return (
      <div className="bg-emerald-50 border border-emerald-200 rounded-2xl px-6 py-8 text-center">
        <div className="text-3xl mb-3">✅</div>
        <p className="font-bold text-slate-800 mb-1">Message sent!</p>
        <p className="text-sm text-slate-500">We&apos;ll get back to you soon.</p>
        <button onClick={() => setStatus("idle")}
          className="mt-4 text-sm text-blue-600 hover:underline">Send another</button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {title && <h3 className="text-lg font-bold text-slate-800">{title}</h3>}

      {fields.includes("name") && (
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Name</label>
          <input
            type="text" value={name} onChange={(e) => setName(e.target.value)}
            placeholder="Your name"
            className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-blue-400"
          />
        </div>
      )}

      {fields.includes("email") && (
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
          <input
            type="email" value={email} onChange={(e) => setEmail(e.target.value)}
            placeholder="your@email.com"
            className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-blue-400"
          />
        </div>
      )}

      {fields.includes("message") && (
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Message</label>
          <textarea
            required value={message} onChange={(e) => setMessage(e.target.value)}
            placeholder={placeholder ?? "Type your message..."}
            rows={4}
            className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-blue-400 resize-none"
          />
        </div>
      )}

      {status === "error" && (
        <p className="text-red-500 text-sm">Something went wrong. Please try again.</p>
      )}

      <button
        type="submit" disabled={status === "sending"}
        className="w-full bg-blue-600 text-white font-bold py-3 rounded-xl hover:bg-blue-700 disabled:opacity-60 transition-colors">
        {status === "sending" ? "Sending..." : "Send message →"}
      </button>
    </form>
  );
}

/* Floating "Report error" button for package pages */
export function ReportButton({ packageId, hospitalName }: { packageId: number; hospitalName: string }) {
  const [open, setOpen] = useState(false);

  if (!open) {
    return (
      <button onClick={() => setOpen(true)}
        className="text-xs text-slate-400 hover:text-orange-500 transition-colors underline underline-offset-2">
        Report incorrect price
      </button>
    );
  }

  return (
    <div className="mt-3 bg-orange-50 border border-orange-200 rounded-xl p-4">
      <ContactForm
        type="correction"
        title="Report incorrect data"
        placeholder={`Something wrong with data for ${hospitalName} (ID: ${packageId})? Describe the issue...`}
        fields={["email", "message"]}
      />
      <button onClick={() => setOpen(false)} className="mt-2 text-xs text-slate-400 hover:text-slate-600">Cancel</button>
    </div>
  );
}
