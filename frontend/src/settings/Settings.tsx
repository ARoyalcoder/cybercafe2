import {
  useEffect,
  useState,
} from "react";
import {
  Shield,
  Upload,
} from "lucide-react";
import { toast } from "sonner";
 
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
      <div className="max-w-5xl mx-auto">
        {/* Header */}

        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white">
            Settings
          </h1>

          <p className="text-slate-400 mt-2">
            Manage account preferences and
            customer upload permissions.
          </p>
        </div>

        {/* Main Settings Card */}

        <div
          className="
          rounded-3xl
          border
          border-white/10
          bg-white/5
          backdrop-blur-xl
          overflow-hidden
        "
        >
          {/* Card Header */}

          <div className="p-6 border-b border-white/10">
            <div className="flex items-center gap-4">
              <div
                className="
                w-14
                h-14
                rounded-2xl
                bg-linear-to-br
                from-violet-500/20
                to-cyan-500/20
                flex
                items-center
                justify-center
              "
              >
                <Shield
                  size={26}
                  className="text-cyan-400"
                />
              </div>

              <div>
                <h2 className="text-xl font-semibold text-white">
                  Upload Permissions
                </h2>

                <p className="text-slate-400 text-sm mt-1">
                  Control whether customers
                  can upload documents.
                </p>
              </div>
            </div>
          </div>

          {/* Body */}

          <div className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex gap-4">
                <div
                  className="
                  w-14
                  h-14
                  rounded-2xl
                  bg-green-500/10
                  flex
                  items-center
                  justify-center
                "
                >
                  <Upload
                    size={24}
                    className="text-green-400"
                  />
                </div>

                <div>
                  <h3 className="font-semibold text-white">
                    Allow Customer Uploads
                  </h3>

                  <p className="text-sm text-slate-400 mt-1 max-w-lg">
                    Customers can upload
                    files using your QR code
                    and public upload link.
                  </p>
                </div>
              </div>

              {/* Toggle */}

              <button
                onClick={toggleUploads}
                className={`
                relative
                inline-flex
                h-8
                w-16
                items-center
                rounded-full
                transition-all
                duration-300

                ${uploadEnabled
                    ? "bg-green-500"
                    : "bg-slate-700"
                  }
              `}
              >
                <span
                  className={`
                  inline-block
                  h-6
                  w-6
                  rounded-full
                  bg-white
                  shadow-lg
                  transition-all
                  duration-300

                  ${uploadEnabled
                      ? "translate-x-9"
                      : "translate-x-1"
                    }
                `}
                />
              </button>
            </div>
          </div>
        </div>

        {/* Status Card */}

        <div
          className="
          mt-8
          rounded-3xl
          bg-linear-to-r
          from-violet-600
          via-blue-600
          to-cyan-500
          p-8
          text-white
          shadow-2xl
        "
        >
          <p className="text-white/80 text-sm">
            Current Status
          </p>

          <h3 className="text-3xl font-bold mt-3">
            {uploadEnabled
              ? "Uploads Enabled"
              : "Uploads Disabled"}
          </h3>

          <p className="mt-3 text-white/90 max-w-2xl">
            {uploadEnabled
              ? "Customers can currently upload documents using your public upload page and QR code."
              : "Customer uploads are currently blocked. Users will not be able to submit files until uploads are enabled again."}
          </p>

          <div className="mt-6 flex items-center gap-3">
            <div
              className={`
              h-3
              w-3
              rounded-full
              ${uploadEnabled
                  ? "bg-green-300"
                  : "bg-red-300"
                }
            `}
            />

            <span className="font-medium">
              {uploadEnabled
                ? "System Operational"
                : "System Restricted"}
            </span>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}