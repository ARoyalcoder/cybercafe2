import { Receipt } from "lucide-react";

export default function EmptyPayments() {
  return (
    <div
      className="
        rounded-3xl
        border
        border-white/10
        bg-white/5
        backdrop-blur-xl
        p-16
        text-center
      "
    >
      <Receipt
        size={60}
        className="mx-auto text-slate-500"
      />

      <h3 className="text-xl font-semibold text-black mt-4">
        No Payments Yet
      </h3>

      <p className="text-slate-400 mt-2">
        Your billing history will appear
        here after your first successful
        payment.
      </p>
    </div>
  );
}