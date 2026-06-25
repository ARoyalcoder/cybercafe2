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
import { toast } from "sonner";
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
      fixed
      left-0
      top-0
      z-50
      h-screen
      w-72
      border-r
      border-white/10
      bg-[#020617]
      backdrop-blur-xl
      flex
      flex-col
    "
    >
      {/* Logo */}

      <div className="h-20 px-6 border-b border-white/10 flex items-center">
        <div className="flex items-center gap-4">
          <div
            className="
            h-12
            w-12
            rounded-2xl
            bg-linear-to-br
            from-violet-600
            via-blue-600
            to-cyan-500
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
            <h1 className="font-bold text-xl text-white">
              DocFlow
            </h1>

            <p className="text-xs text-slate-400">
              Document Platform
            </p>
          </div>
        </div>
      </div>

      {/* Navigation */}

      <div className="flex-1 overflow-y-auto p-4">
        <p
          className="
          px-3
          mb-4
          text-xs
          uppercase
          tracking-widest
          text-slate-500
          font-semibold
        "
        >
          Navigation
        </p>

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
                    rounded-2xl
                    px-4
                    py-3
                    transition-all

                    ${isActive
                        ? `
                          bg-violet-500/10
                          border
                          border-violet-500/20
                          text-white
                        `
                        : `
                          text-slate-400
                          hover:bg-white/5
                          hover:text-white
                        `
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
                            bg-violet-500
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
                              ? "text-violet-400"
                              : "group-hover:translate-x-1"
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

        {/* Premium Card */}


      </div>

      {/* User */}

      <div className="border-t border-white/10 p-4">
        <div
          className="
          rounded-2xl
          bg-white/5
          border
          border-white/10
          p-3
        "
        >
          <div className="flex items-center gap-3">
            <img
              src="https://ui-avatars.com/api/?background=7c3aed&color=fff&name=Admin"
              alt="User"
              className="h-12 w-12 rounded-full"
            />

            <div className="flex-1">
              <h4 className="font-semibold text-white">
                Admin User
              </h4>

              <p className="text-xs text-slate-400">
                Premium Account
              </p>
            </div>
          </div>

          <button
            onClick={
              handleLogout
            }
            className="
            mt-4
            w-full
            rounded-xl
            border
            border-red-500/20
            bg-red-500/10
            py-3
            text-red-400
            flex
            items-center
            justify-center
            gap-2
            hover:bg-red-500/20
            transition
          "
          >
            <LogOut size={18} />
            Logout
          </button>
        </div>

        <p className="mt-4 text-center text-xs text-slate-500">
          Version 1.0.0
        </p>
      </div>
    </aside>
  );
}