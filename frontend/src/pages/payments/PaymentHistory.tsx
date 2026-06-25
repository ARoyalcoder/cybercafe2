import {
  useEffect,
  useState,
} from "react";

import DashboardLayout from "../../layouts/DashboardLayout";
import api from "../../api/axios";

import PaymentStats from "./PaymentStats";
import PaymentCard from "./PaymentCard";
import EmptyPayments from "./EmptyPayments";
import PaymentSkeleton from "./PaymentSkeleton";

export default function PaymentHistory() {
  const [payments, setPayments] =
    useState<any[]>([]);

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {
    const fetchPayments =
      async () => {
        try {
          const res =
            await api.get(
              "/payments/history"
            );

          setPayments(
            res.data.payments || []
          );
        } catch (error) {
          console.error(error);
        } finally {
          setLoading(false);
        }
      };

    fetchPayments();
  }, []);

  const totalSpent =
    payments.reduce(
      (
        acc,
        payment
      ) =>
        acc +
        payment.amount,
      0
    );

  const totalTransactions =
    payments.length;

  const currentPlan =
    payments.length > 0
      ? payments[0]?.plan?.toUpperCase()
      : "FREE";

  if (loading) {
    return (
      <DashboardLayout>
        <div className="max-w-7xl mx-auto">
          <PaymentSkeleton />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto">
        {/* Header */}

        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white">
            Billing & Payments
          </h1>

          <p className="text-slate-400 mt-2">
            Manage subscriptions and
            track payment history.
          </p>
        </div>

        {/* Stats */}

        <PaymentStats
          totalSpent={totalSpent}
          totalTransactions={
            totalTransactions
          }
          currentPlan={
            currentPlan
          }
        />

        {/* Section Header */}

        <div className="mb-6">
          <h2 className="text-2xl font-bold text-white">
            Payment History
          </h2>

          <p className="text-slate-400 mt-1">
            All your successful
            transactions.
          </p>
        </div>

        {/* Content */}

        {payments.length === 0 ? (
          <EmptyPayments />
        ) : (
          <div className="space-y-5">
            {payments.map(
              (payment) => (
                <PaymentCard
                  key={
                    payment._id
                  }
                  payment={
                    payment
                  }
                />
              )
            )}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}