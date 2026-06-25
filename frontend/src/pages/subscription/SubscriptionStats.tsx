import {
  Crown,
  Upload,
  HardDrive,
  Activity,
} from "lucide-react";

interface Props {
  usage: any;
}

export default function SubscriptionStats({
  usage,
}: Props) {
  const stats = [
    {
      label: "Current Plan",
      value: usage.plan,
      icon: Crown,
      color:
        "text-yellow-400 bg-yellow-500/10 border-yellow-500/20",
    },
    {
      label: "Uploads Used",
      value:
        usage.uploadLimit === -1
          ? `${usage.uploadsUsed} / Unlimited`
          : `${usage.uploadsUsed} / ${usage.uploadLimit}`,
      icon: Upload,
      color:
        "text-blue-400 bg-blue-500/10 border-blue-500/20",
    },
    {
      label: "Storage Used",
      value: `${(
        usage.storageUsed /
        1024 /
        1024
      ).toFixed(2)} MB`,
      icon: HardDrive,
      color:
        "text-violet-400 bg-violet-500/10 border-violet-500/20",
    },
    {
      label: "Remaining Uploads",
      value:
        usage.uploadLimit === -1
          ? "∞"
          : usage.uploadLimit -
            usage.uploadsUsed,
      icon: Activity,
      color:
        "text-green-400 bg-green-500/10 border-green-500/20",
    },
  ];

  return (
    <div className="grid gap-5 mt-8 md:grid-cols-2 xl:grid-cols-4">
      {stats.map((item) => {
        const Icon =
          item.icon;

        return (
          <div
            key={item.label}
            className="
              group
              relative
              overflow-hidden
              rounded-3xl
              border
              border-white/10
              bg-white/5
              backdrop-blur-xl
              p-6
              transition-all
              duration-300
              hover:bg-white/10
              hover:border-violet-500/20
              hover:-translate-y-1
            "
          >
            {/* Glow */}

            <div
              className="
                absolute
                inset-0
                opacity-0
                group-hover:opacity-100
                transition-opacity
                duration-300
                bg-linear-to-br
                from-violet-500/5
                via-blue-500/5
                to-cyan-500/5
              "
            />

            <div className="relative z-10">
              <div
                className={`
                  w-14
                  h-14
                  rounded-2xl
                  border
                  flex
                  items-center
                  justify-center
                  ${item.color}
                `}
              >
                <Icon size={26} />
              </div>

              <p className="mt-5 text-sm text-slate-400">
                {item.label}
              </p>

              <h3 className="mt-2 text-2xl font-bold text-white capitalize">
                {item.value}
              </h3>
            </div>
          </div>
        );
      })}
    </div>
  );
}