import { useEffect, useState } from "react";
import toast from "react-hot-toast";

import DashboardLayout from "../../layouts/DashboardLayout";
import Loader from "../../components/Loader/Loader";

import { getUsage } from "../../api/subscriptionApi";
import api from "../../api/axios";
import { loadRazorpay } from "../../utils/loadRazorpay";

import SubscriptionStats from "./SubscriptionStats";
import PlanCard from "./PlanCard";

export default function SubscriptionPage() {
    const [usage, setUsage] = useState<any>(null);
    const [loadingPlan, setLoadingPlan] = useState<string | null>(null);

    const plans = [
        {
            name: "plus",
            price: 15,
            storage: "1 GB",
            uploads: "200 Uploads",
            time: "1 Month",
        },
        {
            name: "prime",
            price: 35,
            storage: "2 GB",
            uploads: "1000 Uploads",
            time: "1 Month",
        },
        {
            name: "pro",
            price: 99,
            storage: "10 GB",
            uploads: "5000 Uploads",
            time: "1 Month",
            featured: true,
        },
    ];

    useEffect(() => {
        fetchUsage();
    }, []);

    const fetchUsage = async () => {
        try {
            const data = await getUsage();
            setUsage(data);
        } catch {
            toast.error("Failed to load subscription data");
        }
    };

    const handleUpgrade = async (plan: string) => {
        try {
            setLoadingPlan(plan);

            const loaded = await loadRazorpay();

            if (!loaded) {
                toast.error("Failed to load Razorpay");
                return;
            }

            const { data } = await api.post(
                "/payments/create-order",
                { plan }
            );

            const razorpay = new window.Razorpay({
                key: import.meta.env.VITE_RAZORPAY_KEY,
                amount: data.amount,
                currency: "INR",
                order_id: data.id,

                name: "Document Hub",
                description: `${plan} Plan Upgrade`,

                prefill: {
                    name: usage?.user?.name || "",
                    email: usage?.user?.email || "",
                },

                theme: {
                    color: "#2563eb",
                },

                handler: async (response: any) => {
                    const verify = await api.post(
                        "/payments/verify",
                        {
                            ...response,
                            plan,
                        }
                    );

                    if (verify.data.success) {
                        toast.success(
                            "Plan upgraded successfully"
                        );

                        await fetchUsage();

                        window.location.href =
                            "/payment-success";
                    }
                },
            });

            razorpay.open();
        } catch {
            toast.error(
                "Failed to create payment order"
            );
        } finally {
            setLoadingPlan(null);
        }
    };

    if (!usage) {
        return (
            <DashboardLayout>
                <div className="min-h-screen flex justify-center items-center">
                    <Loader />
                </div>
            </DashboardLayout>
        );
    }

    return (
        <DashboardLayout>
            {/* Hero */}
            <div className="rounded-3xl bg-linear-to-r from-blue-600 via-indigo-600 to-purple-600 p-10 text-white shadow-xl">
                <h1 className="text-4xl font-bold">
                    Subscription & Billing
                </h1>

                <p className="mt-3 text-blue-100">
                    Manage your subscription, monitor
                    storage usage, and upgrade anytime.
                </p>

                <div className="mt-6 inline-flex rounded-full bg-white/20 px-4 py-2 backdrop-blur">
                    Current Plan:
                    <span className="ml-2 font-semibold capitalize">
                        {usage.plan}
                    </span>
                </div>
            </div>

            <SubscriptionStats usage={usage} />

            <section className="mt-12">
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h2 className="text-3xl font-bold">
                            Pricing Plans
                        </h2>
                        <p className="text-gray-500">
                            Choose the plan that fits
                            your needs.
                        </p>
                    </div>
                </div>

                <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                    {plans.map((plan) => (
                        <PlanCard
                            key={plan.name}
                            plan={plan}
                            currentPlan={usage.plan}
                            loadingPlan={loadingPlan}
                            onUpgrade={handleUpgrade}
                        />
                    ))}
                </div>
            </section>
        </DashboardLayout>
    );
}