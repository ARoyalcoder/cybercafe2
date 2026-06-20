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
            relative rounded-3xl border p-8 shadow-sm transition-all
            hover:-translate-y-1 hover:shadow-xl
            ${
                plan.featured
                    ? "border-blue-600 ring-2 ring-blue-100"
                    : "border-gray-200"
            }
        `}
        >
            {plan.featured && (
                <div className="absolute -top-3 right-5 rounded-full bg-blue-600 px-4 py-1 text-xs font-semibold text-white">
                    Most Popular
                </div>
            )}

            {isCurrent && (
                <div className="mb-4 inline-flex rounded-full bg-green-100 px-3 py-1 text-sm text-green-700">
                    Active Plan
                </div>
            )}

            <h3 className="text-2xl font-bold capitalize">
                {plan.name}
            </h3>

            <div className="my-6">
                <span className="text-5xl font-bold">
                    ₹{plan.price}
                </span>

                <span className="text-gray-500">
                    /month
                </span>
            </div>

            <ul className="space-y-4 text-gray-600">
                <li>✓ {plan.storage} Storage</li>
                <li>✓ {plan.uploads}</li>
                <li>✓ {plan.time}</li>
            </ul>

            <button
                disabled={
                    isCurrent ||
                    loadingPlan === plan.name
                }
                onClick={() =>
                    onUpgrade(plan.name)
                }
                className={`
                    mt-8 w-full rounded-xl py-3 font-medium
                    ${
                        isCurrent
                            ? "bg-gray-200 cursor-not-allowed"
                            : "bg-blue-600 text-white hover:bg-blue-700"
                    }
                `}
            >
                {isCurrent
                    ? "Current Plan"
                    : loadingPlan === plan.name
                    ? "Processing..."
                    : "Upgrade Now"}
            </button>
        </div>
    );
}