import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import DashboardLayout from "../../layouts/DashboardLayout";
import {
  ChevronRight,
  Clock3,
} from "lucide-react";
import {
  FolderOpen,
  FileText,
  HardDrive,
  Crown,
  CreditCard,
  QrCode,
} from "lucide-react";

import {
  getDashboardStats,
  getRecentUploads,
} from "../../api/dashboardApi";

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

  const storageUsedMB =
    (
      (stats?.storageUsed || 0) /
      1024 /
      1024
    ).toFixed(2);

  return (
    <DashboardLayout>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold">
          Welcome Back 👋
        </h1>

        <p className="text-gray-500 mt-1">
          Here's an overview of your account.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-gray-500 text-sm">
                Total Folders
              </p>

              <h2 className="text-3xl font-bold mt-2">
                {stats?.totalFolders ??
                  0}
              </h2>
            </div>

            <FolderOpen
              size={40}
              className="text-blue-500"
            />
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-gray-500 text-sm">
                Total Files
              </p>

              <h2 className="text-3xl font-bold mt-2">
                {stats?.totalFiles ??
                  0}
              </h2>
            </div>

            <FileText
              size={40}
              className="text-green-500"
            />
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-gray-500 text-sm">
                Storage Used
              </p>

              <h2 className="text-3xl font-bold mt-2">
                {storageUsedMB}
                MB
              </h2>
            </div>

            <HardDrive
              size={40}
              className="text-purple-500"
            />
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-gray-500 text-sm">
                Current Plan
              </p>

              <h2 className="text-3xl font-bold mt-2 capitalize">
                {stats?.plan ||
                  "free"}
              </h2>
            </div>

            <Crown
              size={40}
              className="text-yellow-500"
            />
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mt-8">
        <h2 className="text-xl font-bold mb-4">
          Quick Actions
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Link
            to="/payments"
            className="bg-white p-6 rounded-2xl shadow-sm border hover:shadow-md transition"
          >
            <CreditCard
              size={36}
              className="text-blue-500 mb-4"
            />

            <h3 className="font-semibold text-lg">
              Payment History
            </h3>

            <p className="text-gray-500 text-sm mt-1">
              View all payment transactions.
            </p>
          </Link>

          <Link
            to="/qr"
            className="bg-white p-6 rounded-2xl shadow-sm border hover:shadow-md transition"
          >
            <QrCode
              size={36}
              className="text-green-500 mb-4"
            />

            <h3 className="font-semibold text-lg">
              QR Upload
            </h3>

            <p className="text-gray-500 text-sm mt-1">
              Share upload QR and link.
            </p>
          </Link>

          <Link
            to="/folders"
            className="bg-white p-6 rounded-2xl shadow-sm border hover:shadow-md transition"
          >
            <FolderOpen
              size={36}
              className="text-orange-500 mb-4"
            />

            <h3 className="font-semibold text-lg">
              Manage Folders
            </h3>

            <p className="text-gray-500 text-sm mt-1">
              View uploaded documents.
            </p>
          </Link>
        </div>
      </div>

      {/* Recent Uploads */}
      {/* Recent Uploads */}
      <div className="mt-10">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              Recent Uploads
            </h2>

            <p className="text-sm text-gray-500 mt-1">
              Latest customer uploads
            </p>
          </div>

          <Link
            to="/folders"
            className="text-blue-600 font-medium hover:text-blue-700"
          >
            View All
          </Link>
        </div>

        {recentFolders.length === 0 ? (
          <div className="bg-white rounded-3xl border border-gray-200 p-12 text-center">
            <FolderOpen
              size={50}
              className="mx-auto text-gray-300"
            />

            <h3 className="mt-4 text-lg font-semibold text-gray-700">
              No Uploads Yet
            </h3>

            <p className="text-gray-500 mt-2">
              Recent uploads will appear here.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-5 gap-5">
            {recentFolders
              .slice(0, 5)
              .map((folder: any) => (
                <Link
                  key={folder._id}
                  to={`/folders/${folder._id}`}
                  className="
              group
              bg-white
              border
              border-gray-200
              rounded-3xl
              p-5
              shadow-sm
              hover:shadow-lg
              hover:-translate-y-1
              transition-all
              duration-300
            "
                >
                  {/* Top */}

                  <div className="flex items-center justify-between">
                    <div className="w-14 h-14 rounded-2xl bg-blue-50 flex items-center justify-center">
                      <FolderOpen
                        size={28}
                        className="text-blue-600"
                      />
                    </div>

                    <ChevronRight
                      size={18}
                      className="
                  text-gray-300
                  group-hover:text-blue-600
                  group-hover:translate-x-1
                  transition-all
                "
                    />
                  </div>

                  {/* Content */}

                  <div className="mt-5">
                    <h3 className="font-semibold text-gray-900 truncate">
                      {folder.customerName}
                    </h3>

                    <p className="text-sm text-gray-500 truncate mt-1">
                      {folder.folderName}
                    </p>
                  </div>

                  {/* Files */}

                  <div className="mt-5 flex items-center justify-between">
                    <div>
                      <p className="text-xs text-gray-400">
                        Files
                      </p>

                      <p className="font-bold text-lg text-gray-900">
                        {folder.totalFiles}
                      </p>
                    </div>

                    <span className="px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
                      Active
                    </span>
                  </div>

                  {/* Date */}

                  <div className="mt-4 pt-4 border-t border-gray-100 flex items-center gap-2 text-xs text-gray-500">
                    <Clock3 size={13} />

                    {new Date(
                      folder.createdAt
                    ).toLocaleDateString()}
                  </div>
                </Link>
              ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}