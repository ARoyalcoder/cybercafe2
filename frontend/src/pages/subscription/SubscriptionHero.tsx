interface Props {
  currentPlan: string;
}

export default function SubscriptionHero({
  currentPlan,
}: Props) {
  return (
    <div
      className="
        relative
        overflow-hidden
        rounded-3xl
        bg-linear-to-r
        from-violet-600
        via-blue-600
        to-cyan-500
        p-10
        text-white
      "
    >
      <div className="relative z-10">
        <h1 className="text-4xl font-bold">
          Subscription & Billing
        </h1>

        <p className="mt-3 text-slate-100">
          Manage your subscription,
          monitor storage usage,
          and upgrade anytime.
        </p>

        <div
          className="
            mt-6
            inline-flex
            rounded-full
            bg-white/20
            px-4
            py-2
            backdrop-blur
          "
        >
          Current Plan:
          <span className="ml-2 font-semibold capitalize">
            {currentPlan}
          </span>
        </div>
      </div>

      <div
        className="
          absolute
          top-0
          right-0
          w-64
          h-64
          rounded-full
          bg-white/10
          blur-3xl
        "
      />
    </div>
  );
}