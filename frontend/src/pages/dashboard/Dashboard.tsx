import { useEffect, useState } from "react";
import DashboardLayout from "../../layouts/DashboardLayout";

import {
  getDashboardStats,
  getRecentUploads,
} from "../../api/dashboardApi";

import DashboardStats from "./DashboardStats";
import RecentUploads from "./RecentUploads";

export default function Dashboard() {
  const [stats, setStats] =
    useState<any>(null);

  const [
    recentFolders,
    setRecentFolders,
  ] = useState<any[]>([]);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [
          statsRes,
          uploadsRes,
        ] = await Promise.all([
          getDashboardStats(),
          getRecentUploads(),
        ]);

        setStats(
          statsRes.stats
        );

        setRecentFolders(
          uploadsRes.folders
        );
      } catch (error) {
        console.error(error);
      }
    };

    loadData();
  }, []);

  return (
    <DashboardLayout>
      <div className="mb-8">
        <h1 className="text-3xl font-bold">
          Welcome Back 👋
        </h1>

        <p className="text-gray-500 mt-1">
          Here's an overview of your account.
        </p>
      </div>

      <DashboardStats
        stats={stats}
      />

      <RecentUploads
        recentFolders={
          recentFolders
        }
      />
    </DashboardLayout>
  );
}