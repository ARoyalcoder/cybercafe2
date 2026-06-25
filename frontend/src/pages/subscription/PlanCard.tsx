import {
  Crown,
  Check,
  Sparkles,
} from "lucide-react";

interface Props {
  plan: any;
  currentPlan: string;
  loadingPlan: string | null;
  onUpgrade: (plan: string) => void;
}

export default function PlanCard({
  plan,
  currentPlan,
  loadingPlan,
  onUpgrade,
}: Props) {
  const isCurrent =
    plan.name.toLowerCase() ===
    currentPlan?.toLowerCase();

  return (
    <div
      className={`
        relative
        overflow-hidden
        rounded-3xl
        border
        backdrop-blur-xl
        p-8
        transition-all
        duration-300
        hover:-translate-y-2

        ${
          plan.featured
            ? `
              bg-violet-500/10
              border-violet-500/30
              shadow-[0_0_40px_rgba(139,92,246,0.15)]
            `
            : `
              bg-white/5
              border-white/10
              hover:bg-white/10
            `
        }
      `}
    >
      {/* Popular Badge */}

      {plan.featured && (
        <div
          className="
            absolute
            top-5
            right-5
            flex
            items-center
            gap-1
            rounded-full
            bg-violet-500
            px-3
            py-1
            text-xs
            font-semibold
            text-white
          "
        >
          <Sparkles size={12} />
          Most Popular
        </div>
      )}

      {/* Active Badge */}

      {isCurrent && (
        <div
          className="
            mb-5
            inline-flex
            items-center
            gap-2
            rounded-full
            border
            border-green-500/20
            bg-green-500/10
            px-3
            py-1
            text-sm
            font-medium
            text-green-400
          "
        >
          <Check size={14} />
          Active Plan
        </div>
      )}

      {/* Icon */}

      <div
        className="
          mb-6
          flex
          h-14
          w-14
          items-center
          justify-center
          rounded-2xl
          bg-violet-500/10
        "
      >
        <Crown
          size={28}
          className="text-violet-400"
        />
      </div>

      {/* Name */}

      <h3 className="text-2xl font-bold text-white capitalize">
        {plan.name}
      </h3>

      {/* Price */}

      <div className="my-8">
        <span className="text-5xl font-bold text-white">
          ₹{plan.price}
        </span>

        <span className="ml-2 text-slate-400">
          /month
        </span>
      </div>

      {/* Features */}

      <ul className="space-y-4">
        <li className="flex items-center gap-3 text-slate-300">
          <Check
            size={16}
            className="text-green-400"
          />
          {plan.storage} Storage
        </li>

        <li className="flex items-center gap-3 text-slate-300">
          <Check
            size={16}
            className="text-green-400"
          />
          {plan.uploads}
        </li>

        <li className="flex items-center gap-3 text-slate-300">
          <Check
            size={16}
            className="text-green-400"
          />
          {plan.time}
        </li>
      </ul>

      {/* Button */}

      <button
        disabled={
          isCurrent ||
          loadingPlan === plan.name
        }
        onClick={() =>
          onUpgrade(plan.name)
        }
        className={`
          mt-8
          w-full
          rounded-2xl
          py-3.5
          font-semibold
          transition-all

          ${
            isCurrent
              ? `
                bg-white/10
                text-slate-400
                cursor-not-allowed
              `
              : `
                bg-linear-to-r
                from-violet-600
                to-blue-600
                text-white
                hover:from-violet-500
                hover:to-blue-500
              `
          }
        `}
      >
        {isCurrent
          ? "Current Plan"
          : loadingPlan ===
            plan.name
          ? "Processing..."
          : "Upgrade Now"}
      </button>

      {/* Bottom Glow */}

      <div
        className="
          absolute
          -bottom-24
          left-1/2
          h-40
          w-40
          -translate-x-1/2
          rounded-full
          bg-violet-500/10
          blur-3xl
          pointer-events-none
        "
      />
    </div>
  );
}