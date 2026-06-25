import { motion } from "framer-motion";
import {
  ShieldCheck,
  CloudUpload,
  QrCode,
} from "lucide-react";
import {
  Navigate,
} from "react-router-dom";
import {
 
  ArrowRight,
} from "lucide-react";
export default function Login() {
  const token =
    localStorage.getItem(
      "token"
    );

  if (token) {
    return (
      <Navigate
        to="/dashboard"
        replace
      />
    );
  }
  const handleGoogleLogin = () => {
    window.location.href =
      "http://localhost:5000/api/auth/google";
  };

  return (

  <div className="relative min-h-screen overflow-hidden bg-[#030712]">
    {/* Aurora Background */}


<motion.div
  animate={{
    x: [0, 50, 0],
    y: [0, -40, 0],
  }}
  transition={{
    duration: 12,
    repeat: Infinity,
  }}
  className="absolute top-0 left-0 w-125 h-125 bg-violet-600/20 rounded-full blur-[120px]"
/>

<motion.div
  animate={{
    x: [0, -50, 0],
    y: [0, 50, 0],
  }}
  transition={{
    duration: 15,
    repeat: Infinity,
  }}
  className="absolute bottom-0 right-0 w-125 h-125 bg-blue-600/20 rounded-full blur-[120px]"
/>

<div className="relative z-10 min-h-screen flex items-center justify-center px-6">
  <motion.div
    initial={{
      opacity: 0,
      y: 40,
    }}
    animate={{
      opacity: 1,
      y: 0,
    }}
    transition={{
      duration: 0.6,
    }}
    className="
      w-full
      max-w-md
      rounded-4xl
      bg-white/5
      border
      border-white/10
      backdrop-blur-2xl
      p-8
      shadow-[0_0_60px_rgba(139,92,246,0.15)]
    "
  >
    {/* Logo */}

    <div className="flex justify-center mb-6">
      <div
        className="
          w-20
          h-20
          rounded-3xl
          bg-linear-to-br
          from-violet-500
          via-blue-500
          to-cyan-500
          flex
          items-center
          justify-center
          text-white
          text-3xl
          font-bold
          shadow-[0_0_40px_rgba(139,92,246,0.5)]
        "
      >
        D
      </div>
    </div>

    {/* Header */}

    <h1 className="text-center text-4xl font-bold text-white">
      Welcome to DocFlow
    </h1>

    <p className="text-center text-slate-400 mt-3">
      Secure Document Collection Platform
    </p>

    {/* Badge */}

    <div className="flex justify-center mt-5">
      <div className="px-4 py-2 rounded-full bg-green-500/10 border border-green-500/20 text-green-400 text-sm">
        🔒 Google OAuth Secured
      </div>
    </div>

    {/* Features */}

    <div className="mt-8 space-y-4">
      {[
        {
          icon: CloudUpload,
          title: "Easy File Collection",
          desc: "Receive documents instantly.",
          color: "text-violet-400",
          bg: "bg-violet-500/10",
        },
        {
          icon: QrCode,
          title: "QR Based Uploads",
          desc: "Share links in seconds.",
          color: "text-blue-400",
          bg: "bg-blue-500/10",
        },
        {
          icon: ShieldCheck,
          title: "Secure Storage",
          desc: "Protected cloud system.",
          color: "text-cyan-400",
          bg: "bg-cyan-500/10",
        },
      ].map((item, index) => (
        <motion.div
          key={index}
          whileHover={{
            scale: 1.02,
          }}
          className="
            flex
            items-center
            gap-4
            p-4
            rounded-2xl
            bg-white/5
            border
            border-white/10
          "
        >
          <div
            className={`w-12 h-12 rounded-xl flex items-center justify-center ${item.bg}`}
          >
            <item.icon
              size={20}
              className={item.color}
            />
          </div>

          <div>
            <p className="text-white font-medium">
              {item.title}
            </p>

            <p className="text-sm text-slate-400">
              {item.desc}
            </p>
          </div>
        </motion.div>
      ))}
    </div>

    {/* Google Button */}

    <motion.button
      whileHover={{
        scale: 1.02,
        y: -2,
      }}
      whileTap={{
        scale: 0.98,
      }}
      onClick={handleGoogleLogin}
      className="
        mt-8
        w-full
        h-14
        rounded-2xl
        bg-white
        text-black
        font-semibold
        flex
        items-center
        justify-center
        gap-3
        hover:shadow-2xl
        transition-all
      "
    >
      <img
        src="https://www.google.com/favicon.ico"
        alt="Google"
        className="w-5 h-5"
      />

      Continue with Google

      <ArrowRight size={18} />
    </motion.button>

    {/* Footer */}

    <div className="mt-8 text-center">
      <p className="text-xs text-slate-500">
        By continuing you agree to our
        Terms & Privacy Policy
      </p>

      <p className="text-xs text-slate-600 mt-3">
        Powered by Google OAuth
      </p>
    </div>
  </motion.div>
</div>


  </div>
);

}