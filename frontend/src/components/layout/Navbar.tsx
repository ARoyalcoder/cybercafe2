import {
  useEffect,
  useState,
} from "react";
import {
  ChevronDown,
  LinkIcon,

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
      h-20
      px-8
      flex
      items-center
      justify-between
    "
    >
      {/* Left */}

      <div>
        <h2 className="text-2xl font-bold text-white">
          Dashboard
        </h2>

        <p className="text-sm text-slate-400">
          Welcome back,{" "}
          {user?.name || "User"}
        </p>
      </div>

      {/* Right */}

      <div className="flex items-center gap-4">
        {/* Search */}



















































































































































































































































































































































































































































































































































































































































































































































































































































































        {/* Notifications */}


        {/* Profile */}

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
            rounded-2xl
            border
            border-white/10
            bg-white/5
            px-3
            py-2
            backdrop-blur-xl
          "
          >
            <div
              className="
              h-11
              w-11
              rounded-full
              bg-linear-to-br
              from-violet-600
              via-blue-600
              to-cyan-500
              flex
              items-center
              justify-center
              text-white
              font-bold
            "
            >
              {user?.name
                ?.charAt(0)
                ?.toUpperCase()}
            </div>

            <div className="hidden md:block text-left">
              <p className="text-sm font-semibold text-white">
                {user?.name}
              </p>

              <p className="text-xs text-slate-400">
                Administrator
              </p>
            </div>

            <ChevronDown
              size={16}
              className="text-slate-500"
            />
          </button>

          {showProfile && (
            <div
              className="
              absolute
              right-0
              top-16
              w-105
              overflow-hidden
              rounded-3xl
              border
              border-white/10
              bg-[#0f172a]
              backdrop-blur-2xl
              shadow-2xl
            "
            >
              {/* Header */}

              <div
                className="
                bg-linear-to-r
                from-violet-600
                via-blue-600
                to-cyan-500
                p-6
                text-white
              "
              >
                <div className="flex items-center gap-4">
                  <div
                    className="
                    h-16
                    w-16
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

                    <p className="text-sm text-white/80">
                      {user?.email}
                    </p>
                  </div>
                </div>
              </div>

              {/* Body */}

              <div className="p-5 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div
                    className="
                    rounded-2xl
                    border
                    border-white/10
                    bg-white/5
                    p-4
                  "
                  >
                    <p className="text-xs text-slate-500">
                      Account
                    </p>

                    <p className="mt-1 font-semibold text-white">
                      Premium
                    </p>
                  </div>

                  <div
                    className="
                    rounded-2xl
                    border
                    border-white/10
                    bg-white/5
                    p-4
                  "
                  >
                    <p className="text-xs text-slate-500">
                      Uploads
                    </p>

                    <p
                      className={`mt-1 font-semibold ${user?.uploadEnabled
                          ? "text-green-400"
                          : "text-red-400"
                        }`}
                    >
                      {user?.uploadEnabled
                        ? "Enabled"
                        : "Disabled"}
                    </p>
                  </div>
                </div>

                <div
                  className="
                  rounded-2xl
                  border
                  border-white/10
                  bg-white/5
                  p-4
                "
                >
                  <div className="flex items-center gap-2 mb-2 text-slate-400">
                    <LinkIcon size={14} />
                    Public Upload Link
                  </div>

                  <p className="break-all text-sm text-white">
                    {user?.publicLink}
                  </p>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-500">
                      User ID
                    </span>

                    <span className="text-white">
                      {user?._id?.slice(-8)}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-500">
                      Email
                    </span>

                    <span className="text-white">
                      {user?.email}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}