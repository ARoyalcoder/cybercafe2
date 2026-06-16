import {
  useEffect,
  useState,
} from "react";
import {
  ChevronDown,
 
} from "lucide-react";
import { getProfile } from "../../api/authApi";


export default function Navbar() {
  const [user, setUser] =
    useState<any>(null);
  const [showProfile, setShowProfile] =
    useState(false);
  useEffect(() => {
    getProfile()
      .then((res) =>
        setUser(res.user)
      )
      .catch(console.error);
  }, []);

  return (
    <header
      className="
        sticky
        top-0
        z-40
        h-20
        px-6
        bg-white/80
        backdrop-blur-xl
        border-b
        border-gray-200
        flex
        items-center
        justify-between
      "
    >
      {/* Left Section */}

      <div>
        <h2 className="text-2xl font-bold text-gray-900">
          Dashboard
        </h2>

        <p className="text-sm text-gray-500">
          Welcome back,
          {" "}
          {user?.name || "User"}
        </p>
      </div>

      {/* Right Section */}

      <div className="flex items-center gap-4">
        {/* Search */}





        {/* User Profile */}

        <div
          className="relative"
          onMouseEnter={() =>
            setShowProfile(true)
          }
          onMouseLeave={() =>
            setShowProfile(false)
          }
        >
          <button
            className="
      flex
      items-center
      gap-3
      bg-white
      border
      border-gray-200
      rounded-2xl
      px-3
      py-2
      hover:shadow-md
      transition
    "
          >
            <div
              className="
        w-11
        h-11
        rounded-full
        bg-linear-to-br
        from-blue-600
        to-indigo-600
        text-white
        flex
        items-center
        justify-center
        font-bold
      "
            >
              {user?.name?.charAt(0)}
            </div>

            <div className="hidden md:block text-left">
              <p className="font-semibold text-sm text-gray-900">
                {user?.name}
              </p>

              <p className="text-xs text-gray-500">
                Administrator
              </p>
            </div>

            <ChevronDown
              size={16}
              className="text-gray-400"
            />
          </button>

          {/* Dropdown */}
          {showProfile && (
            <div
              className="
        absolute
        right-0
        top-16
        w-96
        bg-white
        rounded-3xl
        border
        border-gray-200
        shadow-2xl
        overflow-hidden
        z-50
      "
            >
              {/* Header */}

              <div
                className="
          bg-linear-to-br
          from-blue-600
          to-indigo-600
          p-6
          text-white
        "
              >
                <div className="flex items-center gap-4">
                  <div
                    className="
              w-16
              h-16
              rounded-full
              bg-white/20
              flex
              items-center
              justify-center
              text-2xl
              font-bold
            "
                  >
                    {user?.name
                      ?.charAt(0)
                      ?.toUpperCase()}
                  </div>

                  <div>
                    <h3 className="font-bold text-lg">
                      {user?.name}
                    </h3>

                    <p className="text-blue-100 text-sm">
                      {user?.email}
                    </p>
                  </div>
                </div>
              </div>

              {/* Body */}

              <div className="p-5 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gray-50 rounded-2xl p-4">
                    <p className="text-xs text-gray-500">
                      Account Type
                    </p>

                    <p className="font-semibold mt-1">
                      Premium
                    </p>
                  </div>

                  <div className="bg-gray-50 rounded-2xl p-4">
                    <p className="text-xs text-gray-500">
                      Upload Status
                    </p>

                    <p
                      className={`font-semibold mt-1 ${user?.uploadEnabled
                        ? "text-green-600"
                        : "text-red-600"
                        }`}
                    >
                      {user?.uploadEnabled
                        ? "Enabled"
                        : "Disabled"}
                    </p>
                  </div>
                </div>

                {/* Public Link */}

                <div className="bg-gray-50 rounded-2xl p-4">
                  <p className="text-xs text-gray-500 mb-2">
                    Public Upload Link
                  </p>

                  <p className="text-sm break-all text-gray-700">
                    {user?.publicLink}
                  </p>
                </div>

                {/* User Info */}

                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-500">
                      User ID
                    </span>

                    <span className="font-medium">
                      {user?._id?.slice(-8)}
                    </span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-gray-500">
                      Joined
                    </span>

                    <span className="font-medium">
                      {new Date(
                        user?.createdAt
                      ).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>

              {/* Footer */}

              
            </div>
          )}
        </div>
      </div>
    </header>
  );
}