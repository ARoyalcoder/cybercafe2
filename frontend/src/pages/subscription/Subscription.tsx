import { useEffect, useState } from "react";
import { toast } from "sonner";
import DashboardLayout from "../../layouts/DashboardLayout";
import Loader from "../../components/Loader/Loader";

import { getUsage } from "../../api/subscriptionApi";
import api from "../../api/axios";
import { loadRazorpay } from "../../utils/loadRazorpay";

import SubscriptionHero from "./SubscriptionHero";
import SubscriptionStats from "./SubscriptionStats";
import PlanCard from "./PlanCard";

export default function SubscriptionPage() {
  const [usage, setUsage] =
    useState<any>(null);

  const [loadingPlan, setLoadingPlan] =
    useState<string | null>(null);

  const plans = [
    {
      name: "plus",
      price: 15,
      storage: "1 GB",
      uploads: "350 Uploads",
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

  const fetchUsage =
    async () => {
      try {
        const data =
          await getUsage();

        setUsage(data);
      } catch {
        toast.error(
          "Failed to load subscription data"
        );
      }
    };

  const handleUpgrade =
    async (plan: string) => {
      try {
        setLoadingPlan(plan);

        const loaded =
          await loadRazorpay();

        if (!loaded) {
          toast.error(
            "Failed to load Razorpay"
          );
          return;
        }

        const { data } =
          await api.post(
            "/payments/create-order",
            { plan }
          );

        const razorpay =
          new window.Razorpay({
            key: import.meta.env
              .VITE_RAZORPAY_KEY,

            amount:
              data.amount,

            currency:
              "INR",

            order_id:
              data.id,

            name:
              "DocFlow",

            description: `${plan} Plan Upgrade`,

            prefill: {
              name:
                usage?.user
                  ?.name ||
                "",

              email:
                usage?.user
                  ?.email ||
                "",
            },

            theme: {
              color:
                "#8B5CF6",
            },

            handler:
              async (
                response: any
              ) => {
                const verify =
                  await api.post(
                    "/payments/verify",
                    {
                      ...response,
                      plan,
                    }
                  );

                if (
                  verify.data
                    .success
                ) {
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
        setLoadingPlan(
          null
        );
      }
    };

  if (!usage) {
    return (
      <DashboardLayout>
        <div className="min-h-screen flex items-center justify-center">
          <Loader />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="min-h-screen bg-[#030712]">
        <div className="max-w-7xl mx-auto p-4 md:p-6">
          {/* Hero */}

          <SubscriptionHero
            currentPlan={
              usage.plan
            }
          />

          {/* Usage Stats */}

          <SubscriptionStats
            usage={usage}
          />

          {/* Plans */}

          <section className="mt-12">
            <div className="mb-8">
              <h2 className="text-3xl font-bold text-white">
                Pricing Plans
              </h2>

              <p className="mt-2 text-slate-400">
                Choose the
                perfect plan
                for your
                document
                collection
                needs.
              </p>
            </div>

            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              {plans.map(
                (plan) => (
                  <PlanCard
                    key={
                      plan.name
                    }
                    plan={
                      plan
                    }
                    currentPlan={
                      usage.plan
                    }
                    loadingPlan={
                      loadingPlan
                    }
                    onUpgrade={
                      handleUpgrade
                    }
                  />
                )
              )}
            </div>
          </section>
        </div>
      </div>
    </DashboardLayout>
  );
}