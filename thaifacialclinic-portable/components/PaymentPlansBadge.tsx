// "Pay over time" trust badge for high-ticket procedures.
// Inline pill near pricing. Shows installment math for given total.

export default function PaymentPlansBadge({ totalTHB }: { totalTHB?: number }) {
  if (!totalTHB || totalTHB < 30_000) return null; // Only show for big procedures

  const months = 6;
  const monthly = Math.ceil(totalTHB / months / 100) * 100;

  return (
    <div className="inline-flex items-center gap-2 rounded-full border-2 border-indigo-300 bg-indigo-50 px-3 py-1.5 text-xs font-bold text-indigo-900">
      <span>💳</span>
      <span>
        0% installments · <strong>฿{monthly.toLocaleString()}/mo × {months}</strong>
      </span>
    </div>
  );
}
