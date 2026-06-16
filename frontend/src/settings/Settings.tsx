import {
  useEffect,
  useState,
} from "react";
import {
  Shield,
  Upload,
} from "lucide-react";

import toast from "react-hot-toast";
import api from "../api/axios";
import DashboardLayout from "../layouts/DashboardLayout";

export default function Settings() {
  const [
    uploadEnabled,
    setUploadEnabled,
  ] = useState(false);

  useEffect(() => {
    api
      .get("/auth/me")
      .then((res) =>
        setUploadEnabled(
          res.data.user
            .uploadEnabled
        )
      );
  }, []);

  const toggleUploads =
    async () => {
      try {
        const response =
          await api
            .patch(
              "/folders/upload-permission"
            );

        setUploadEnabled(
          response.data
            .uploadEnabled
        );

        toast.success(
          response.data
            .uploadEnabled
            ? "Uploads Enabled"
            : "Uploads Disabled"
        );
      } catch {
        toast.error(
          "Failed to update"
        );
      }
    };

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Settings
          </h1>

          <p className="text-gray-500 mt-2">
            Manage your account preferences and upload permissions.
          </p>
        </div>

        {/* Settings Card */}
        <div className="bg-white rounded-3xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-gray-100">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-blue-50 flex items-center justify-center">
                <Shield
                  size={24}
                  className="text-blue-600"
                />
              </div>

              <div>
                <h2 className="text-xl font-semibold">
                  Upload Permissions
                </h2>

                <p className="text-gray-500 text-sm">
                  Control whether customers can upload files.
                </p>
              </div>
            </div>
          </div>

          <div className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex gap-4">
                <div className="w-12 h-12 rounded-xl bg-green-50 flex items-center justify-center">
                  <Upload
                    size={22}
                    className="text-green-600"
                  />
                </div>

                <div>
                  <h3 className="font-semibold text-gray-900">
                    Allow Customer Uploads
                  </h3>

                  <p className="text-sm text-gray-500 mt-1">
                    Customers can upload files using
                    your public QR link when enabled.
                  </p>
                </div>
              </div>

              {/* Premium Toggle */}
              <button
                onClick={toggleUploads}
                className={`relative inline-flex h-7 w-14 items-center rounded-full transition-all duration-300 ${uploadEnabled
                    ? "bg-green-500"
                    : "bg-gray-300"
                  }`}
              >
                <span
                  className={`inline-block h-5 w-5 transform rounded-full bg-white shadow-md transition-all duration-300 ${uploadEnabled
                      ? "translate-x-8"
                      : "translate-x-1"
                    }`}
                />
              </button>
            </div>
          </div>
        </div>

        {/* Status Card */}
        <div className="mt-6 bg-linear-to-r from-blue-600 to-indigo-600 text-white rounded-3xl p-6 shadow-lg">
          <p className="text-sm opacity-80">
            Current Status
          </p>

          <h3 className="text-2xl font-bold mt-2">
            {uploadEnabled
              ? "Uploads Enabled"
              : "Uploads Disabled"}
          </h3>

          <p className="mt-2 text-blue-100">
            {uploadEnabled
              ? "Customers can currently upload files through your public upload page."
              : "Customer uploads are currently blocked."}
          </p>
        </div>
      </div>
    </DashboardLayout>
  );
}