import {
  LayoutDashboard,
  Folder,
  CreditCard,
  Settings,
  QrCode,
  ChevronRight,
  LogOut,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { logoutUser } from "../../api/authApi";
import toast from "react-hot-toast";
import { NavLink } from "react-router-dom";
import { motion } from "framer-motion";

const menuItems = [
  {
    name: "Dashboard",
    path: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    name: "Folders",
    path: "/folders",
    icon: Folder,
  },
  {
    name: "Subscription",
    path: "/subscription",
    icon: CreditCard,
  },
  {
    name: "Settings",
    path: "/settings",
    icon: Settings,
  },
  {
    name: "QR Code",
    path: "/qr",
    icon: QrCode,
  },
];

export default function Sidebar() {
  const navigate =
    useNavigate();
  const handleLogout =
    async () => {
      try {
        await logoutUser();

        localStorage.removeItem(
          "token"
        );

        localStorage.removeItem(
          "user"
        );

        localStorage.removeItem(
          "deviceId"
        );

        toast.success(
          "Logged out successfully"
        );

        navigate("/login");
      } catch (error) {
        console.error(error);

        toast.error(
          "Logout failed"
        );
      }
    };
  return (
    <aside
      className="
        w-72
        h-screen
        sticky
        top-0
        flex
        flex-col
        bg-white/90
        backdrop-blur-xl
        border-r
        border-gray-200
        shadow-sm
      "
    >
      {/* Logo Section */}

      <div className="h-20 px-6 border-b border-gray-200 flex items-center">
        <div className="flex items-center gap-3">
          <div
            className="
              w-12
              h-12
              rounded-2xl
              bg-linear-to-br
              from-blue-600
              to-indigo-600
              flex
              items-center
              justify-center
              text-white
              font-bold
              text-lg
              shadow-lg
            "
          >
            D
          </div>

          <div>
            <h1 className="text-xl font-bold text-gray-900">
              DocFlow
            </h1>

            <p className="text-xs text-gray-500">
              Document Management
            </p>
          </div>
        </div>
      </div>

      {/* Navigation */}

      <div className="flex-1 overflow-y-auto p-4">
        <div className="mb-4">
          <p className="px-3 text-xs font-semibold uppercase tracking-wider text-gray-400">
            Main Menu
          </p>
        </div>

        <nav className="space-y-2">
          {menuItems.map(
            (item) => {
              const Icon =
                item.icon;

              return (
                <motion.div
                  key={
                    item.path
                  }
                  whileHover={{
                    x: 4,
                  }}
                  transition={{
                    duration: 0.15,
                  }}
                >
                  <NavLink
                    to={
                      item.path
                    }
                    className={({
                      isActive,
                    }) =>
                      `
                      group
                      relative
                      flex
                      items-center
                      justify-between
                      px-4
                      py-3
                      rounded-2xl
                      transition-all
                      duration-200
                      ${isActive
                        ? "bg-linear-to-r from-blue-50 to-indigo-50 text-blue-700 shadow-sm"
                        : "text-gray-600 hover:bg-gray-50"
                      }
                    `
                    }
                  >
                    {({
                      isActive,
                    }) => (
                      <>
                        {isActive && (
                          <div
                            className="
                              absolute
                              left-0
                              top-2
                              bottom-2
                              w-1
                              rounded-r-full
                              bg-blue-600
                            "
                          />
                        )}

                        <div className="flex items-center gap-3">
                          <Icon
                            size={
                              20
                            }
                          />

                          <span className="font-medium">
                            {
                              item.name
                            }
                          </span>
                        </div>

                        <ChevronRight
                          size={16}
                          className={`
                            transition-all
                            ${isActive
                              ? "text-blue-600"
                              : "text-gray-300 group-hover:translate-x-1"
                            }
                          `}
                        />
                      </>
                    )}
                  </NavLink>
                </motion.div>
              );
            }
          )}
        </nav>

        {/* Storage Card */}

        {/* <div className="mt-8">
          <div
            className="
              rounded-3xl
              bg-linear-to-br
              from-blue-600
              via-indigo-600
              to-indigo-700
              p-5
              text-white
              shadow-xl
            "
          >
            <div className="w-11 h-11 rounded-xl bg-white/20 flex items-center justify-center mb-4">
              <Crown
                size={22}
              />
            </div>

            <h3 className="font-bold text-lg">
              Premium Plan
            </h3>

            <p className="text-blue-100 text-sm mt-2 leading-relaxed">
              Get larger storage,
              advanced analytics,
              custom branding and
              priority support.
            </p>

            <div className="mt-5">
              <div className="flex justify-between text-sm mb-2">
                <span>
                  Storage
                </span>

                <span>
                  4.2 GB / 10 GB
                </span>
              </div>

              <div className="h-2 rounded-full bg-white/20 overflow-hidden">
                <div
                  className="
                    h-full
                    w-[42%]
                    bg-white
                    rounded-full
                  "
                />
              </div>
            </div>

            <button
              className="
                mt-5
                w-full
                py-2.5
                rounded-xl
                bg-white
                text-blue-700
                font-semibold
                hover:bg-gray-100
                transition
              "
            >
              Upgrade Plan
            </button>
          </div>
        </div> */}
      </div>

      {/* User Section */}

      <div className="border-t border-gray-200 p-4">
        <div className="flex items-center gap-3">
          <img
            src="https://ui-avatars.com/api/?background=2563eb&color=fff&name=Admin"
            alt="Profile"
            className="w-12 h-12 rounded-full"
          />

          <div className="flex-1 min-w-0">
            <h4 className="font-semibold text-gray-900 truncate">
              Admin User
            </h4>

            <p className="text-xs text-gray-500">
              Premium Account
            </p>
          </div>
        </div>

        <button
          onClick={handleLogout}
          className="
    mt-4
    w-full
    flex
    items-center
    justify-center
    gap-2
    py-3
    rounded-xl
    border
    border-gray-200
    text-gray-700
    hover:bg-red-50
    hover:text-red-600
    transition
  "
        >
          <LogOut size={18} />
          Logout
        </button>

        <div className="mt-4 text-center text-xs text-gray-400">
          Version 1.0.0
        </div>
      </div>
    </aside>
  );
}