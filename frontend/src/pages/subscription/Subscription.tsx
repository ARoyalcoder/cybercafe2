import {
    useEffect,
    useState,
} from "react";

import toast from "react-hot-toast";

import DashboardLayout from "../../layouts/DashboardLayout";

import {
    getUsage,
} from "../../api/subscriptionApi";

import api from "../../api/axios";

import {
    loadRazorpay,
} from "../../utils/loadRazorpay";
import Loader from "../../components/Loader/Loader";

export default function Subscription() {
    const [usage, setUsage] =
        useState<any>(null);

    const [loadingPlan, setLoadingPlan] =
        useState<string | null>(null);

    const plans = [
        {
            name: "plus",
            price: 15,
            storage: "1 GB",
            uploads: "200 Uploads",
            time: "1 month",
        },
        {
            name: "prime",
            price: 35,
            storage: "2 GB",
            uploads: "1000 Uploads",
            time: "1 month",

        },
        {
            name: "pro",
            price: 99,
            storage: "10 GB",
            uploads: "5000 Uploads",
            time: "1 month",
        },
    ];

    useEffect(() => {
        fetchUsage();
    }, []);

    const fetchUsage =
        async () => {
            try {
                const data =
                    await getUsage();

                setUsage(data);
            } catch (error) {
                console.error(error);

                toast.error(
                    "Failed to load subscription data"
                );
            }
        };

    const handleUpgrade =
        async (
            plan: string
        ) => {
            try {
                setLoadingPlan(
                    plan
                );

                const loaded =
                    await loadRazorpay();

                if (!loaded) {
                    toast.error(
                        "Failed to load Razorpay"
                    );

                    return;
                }

                const {
                    data,
                } = await api.post(
                    "/payments/create-order",
                    {
                        plan,
                    }
                );
                console.log(data);
                const options = {
                    key:
                        import.meta.env
                            .VITE_RAZORPAY_KEY,

                    amount:
                        data.amount,

                    currency:
                        "INR",

                    order_id:
                        data.id,

                    name:
                        "Document Hub",

                    description:
                        `${plan} Plan Upgrade`,

                    handler:
                        async (
                            response: any
                        ) => {
                            try {
                                const verifyResponse =
                                    await api.post(
                                        "/payments/verify",
                                        {
                                            razorpay_order_id:
                                                response.razorpay_order_id,

                                            razorpay_payment_id:
                                                response.razorpay_payment_id,

                                            razorpay_signature:
                                                response.razorpay_signature,

                                            plan,
                                        }
                                    );

                                if (
                                    verifyResponse
                                        .data
                                        .success
                                ) {
                                    toast.success(
                                        "Plan upgraded successfully"
                                    );

                                    await fetchUsage();

                                    window.location.href =
                                        "/payment-success";
                                }
                            } catch (
                            error
                            ) {
                                console.error(
                                    error
                                );

                                toast.error(
                                    "Payment verification failed"
                                );
                            }
                        },

                    prefill: {
                        name:
                            usage?.user?.name ||
                            "",

                        email:
                            usage?.user?.email ||
                            "",
                    },

                    theme: {
                        color:
                            "#2563eb",
                    },

                    modal: {
                        ondismiss:
                            () => {
                                setLoadingPlan(
                                    null
                                );
                            },
                    },
                };
                console.log(options);
                const razorpay =
                    new (
                        window as any
                    ).Razorpay(
                        options
                    );

                razorpay.open();
            } catch (error) {
                console.error(
                    error
                );

                toast.error(
                    "Failed to create payment order"
                );

            } finally {
                setLoadingPlan(
                    null
                );
            }
        };

    if (!usage) {
        return (
            <DashboardLayout>
                <div className="flex flex-1 items-center justify-center min-h-screen ">
                    <Loader />
                </div>
            </DashboardLayout>
        );
    }

    return (
        <DashboardLayout>
            <div className="mb-10">
                <div className="bg-linear-to-r from-blue-600 via-indigo-600 to-purple-600 rounded-4xl p-8 text-white shadow-xl">
                    <h1 className="text-4xl font-bold">
                        Subscription & Billing
                    </h1>

                    <p className="mt-3 text-blue-100">
                        Manage your plan, storage usage and
                        document upload limits.
                    </p>

                    <div className="mt-6 inline-flex items-center px-4 py-2 rounded-full bg-white/20 backdrop-blur-sm">
                        Current Plan:
                        <span className="ml-2 font-semibold capitalize">
                            {usage.plan}
                        </span>
                    </div>
                </div>
            </div>

            {/* Usage Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-white p-6 rounded-xl shadow">
                    <p className="text-gray-500">
                        Current Plan
                    </p>

                    <h2 className="text-2xl font-bold mt-2 capitalize">
                        {usage.plan}
                    </h2>
                </div>

                <div className="bg-white p-6 rounded-xl shadow">
                    <p className="text-gray-500">
                        Uploads Used
                    </p>

                    <h2 className="text-2xl font-bold mt-2">
                        {usage.uploadLimit === -1
                            ? `${usage.uploadsUsed} / Unlimited`
                            : `${usage.uploadsUsed} / ${usage.uploadLimit}`}
                    </h2>
                </div>

                <div className="bg-white p-6 rounded-xl shadow">
                    <p className="text-gray-500">
                        Storage Used
                    </p>

                    <h2 className="text-2xl font-bold mt-2">
                        {(
                            usage.storageUsed /
                            1024 /
                            1024
                        ).toFixed(
                            2
                        )}
                        MB
                    </h2>
                </div>

                <div className="bg-white p-6 rounded-xl shadow">
                    <p className="text-gray-500">
                        Remaining Uploads
                    </p>
                    <h2 className="text-2xl font-bold mt-2">
                        {usage.uploadLimit === -1
                            ? "∞"
                            : usage.uploadLimit -
                            usage.uploadsUsed}
                    </h2>
                </div>
            </div>

            {/* Plans */}
            <div className="mt-10">
                <h2 className="text-2xl font-bold mb-6">
                    Available Plans
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {plans.map(
                        (
                            plan
                        ) => {
                            const isCurrentPlan =
                                plan.name.toLowerCase() ===
                                usage.plan?.toLowerCase();

                            return (
                                <div
                                    key={
                                        plan.name
                                    }
                                    className={`rounded-xl p-6 shadow border ${isCurrentPlan
                                        ? "border-blue-500 bg-blue-50"
                                        : "bg-white"
                                        }`}
                                >
                                    {isCurrentPlan && (
                                        <div className="mb-3 inline-block px-3 py-1 text-sm rounded-full bg-blue-500 text-white">
                                            Current
                                            Plan
                                        </div>
                                    )}

                                    <h3 className="text-xl font-bold">
                                        {
                                            plan.name
                                        }
                                    </h3>

                                    <p className="text-4xl font-bold my-4">
                                        ₹
                                        {
                                            plan.price
                                        }
                                    </p>

                                    <ul className="space-y-2 text-gray-600">
                                        <li>
                                            ✓{" "}
                                            {
                                                plan.storage
                                            }{" "}
                                            Storage
                                        </li>

                                        <li>
                                            ✓{" "}
                                            {
                                                plan.uploads
                                            }
                                        </li>
                                        <li>
                                            ✓{" "}
                                            {
                                                plan.time
                                            }
                                        </li>
                                    </ul>

                                    <button
                                        disabled={
                                            isCurrentPlan ||
                                            loadingPlan ===
                                            plan.name
                                        }
                                        onClick={() =>
                                            handleUpgrade(
                                                plan.name
                                            )
                                        }
                                        className={`w-full mt-6 py-2 rounded-lg font-medium ${isCurrentPlan
                                            ? "bg-gray-300 cursor-not-allowed"
                                            : "bg-blue-600 text-white hover:bg-blue-700"
                                            }`}
                                    >
                                        {isCurrentPlan
                                            ? "Current Plan"
                                            : loadingPlan ===
                                                plan.name
                                                ? "Processing..."
                                                : "Upgrade"}
                                    </button>
                                </div>
                            );
                        }
                    )}
                </div>
            </div>
        </DashboardLayout>
    );
}