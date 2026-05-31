"use client";
// Floating WhatsApp button. Sits left of LiveChatBubble (which is right). Visible always.
// Pre-fills a useful message.

import { CONTACT } from "@/lib/contact";

const WA_NUMBER = CONTACT.whatsapp.number;
const PREFILL = "Hi! I'm interested in booking a consult through bkkclinics. Could you help?";

export default function WhatsAppCTA() {
  const link = `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(PREFILL)}`;
  return (
    <a
      href={link}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat on WhatsApp"
      className="fixed bottom-44 right-6 z-30 grid place-items-center h-14 w-14 rounded-full bg-[#25d366] text-white text-3xl shadow-xl hover:shadow-2xl hover:-translate-y-0.5 transition print:hidden"
    >
      <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
        <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zM18.32 15.33c.075-.054.121-.094.121-.232 0-.139-.022-.276-.046-.345-.077-.231-.694-1.06-.808-1.122-.114-.062-.394-.196-.502-.064-.139.169-.694.787-.857.946-.163.158-.32.179-.594.06-.275-.119-1.158-.426-2.207-1.36-.815-.726-1.366-1.62-1.527-1.894-.16-.275-.017-.422.122-.561.124-.124.275-.32.413-.48.139-.16.184-.275.275-.459.092-.184.046-.345-.023-.483-.069-.139-.616-1.486-.844-2.034-.222-.534-.448-.462-.616-.471-.158-.008-.341-.01-.524-.01-.184 0-.482.069-.733.345-.252.276-.962.94-.962 2.297 0 1.357.985 2.668 1.122 2.852.139.183 1.94 2.965 4.703 4.156.658.284 1.171.453 1.571.581.66.21 1.26.18 1.735.109.529-.079 1.629-.665 1.859-1.308.229-.643.229-1.193.16-1.308-.069-.114-.252-.183-.527-.321z" />
      </svg>
    </a>
  );
}
