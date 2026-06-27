"use client";
import { useState } from "react";

const WA_NUMBER = "66800000000"; // placeholder — replace with real number in env

export function WhatsAppCTA() {
  const [dismissed, setDismissed] = useState(false);
  if (dismissed) return null;

  const waUrl = `https://wa.me/${process.env.NEXT_PUBLIC_WA_NUMBER ?? WA_NUMBER}?text=${encodeURIComponent("Hi, I'd like help choosing a health check-up package in Thailand.")}`;

  return (
    <div className="fixed bottom-20 right-4 z-50 md:bottom-6 flex flex-col items-end gap-2">
      <div className="bg-white border border-slate-200 rounded-xl shadow-lg px-3 py-2 text-xs text-slate-600 max-w-[170px] text-center relative animate-fade-in">
        <button
          onClick={() => setDismissed(true)}
          className="absolute -top-1.5 -right-1.5 bg-slate-200 rounded-full w-4 h-4 flex items-center justify-center text-[10px] text-slate-500 hover:bg-slate-300"
        >×</button>
        Ask us which package is right for you
      </div>
      <a
        href={waUrl}
        target="_blank"
        rel="noopener noreferrer"
        title="Chat on WhatsApp"
        className="w-14 h-14 bg-[#25D366] rounded-full flex items-center justify-center shadow-lg hover:bg-[#1ebe5d] hover:scale-105 transition-all active:scale-95"
      >
        <svg viewBox="0 0 32 32" fill="white" className="w-8 h-8">
          <path d="M16 2C8.268 2 2 8.268 2 16c0 2.478.672 4.802 1.845 6.797L2 30l7.41-1.818A13.934 13.934 0 0016 30c7.732 0 14-6.268 14-14S23.732 2 16 2zm0 25.5a11.47 11.47 0 01-5.847-1.6l-.42-.25-4.395 1.079 1.11-4.28-.275-.44A11.5 11.5 0 1116 27.5zm6.406-8.594c-.35-.175-2.074-1.022-2.395-1.14-.32-.116-.553-.174-.786.175-.233.35-.903 1.14-1.107 1.374-.204.233-.407.262-.757.087-.35-.175-1.478-.545-2.816-1.74-1.04-.927-1.742-2.072-1.946-2.422-.204-.35-.022-.539.153-.713.157-.157.35-.408.525-.612.175-.204.233-.35.35-.583.117-.233.059-.437-.029-.612-.087-.175-.786-1.894-1.078-2.594-.285-.68-.574-.588-.786-.6-.204-.01-.437-.012-.67-.012s-.612.087-.932.437c-.32.35-1.224 1.196-1.224 2.915 0 1.72 1.253 3.38 1.428 3.614.175.233 2.466 3.767 5.977 5.281.836.36 1.487.576 1.995.737.838.268 1.601.23 2.204.14.672-.1 2.074-.848 2.366-1.667.291-.82.291-1.522.204-1.668-.087-.145-.32-.233-.67-.408z"/>
        </svg>
      </a>
    </div>
  );
}
