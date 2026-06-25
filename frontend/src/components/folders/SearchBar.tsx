import { Search } from "lucide-react";

type Props = {
  value: string;
  onChange: (
    value: string
  ) => void;
};

export default function SearchBar({
  value,
  onChange,
}: Props) {
  return (
    <div className="relative w-full">
      {/* Search Icon */}

      <Search
        size={18}
        className="
          absolute
          left-4
          top-1/2
          -translate-y-1/2
          text-slate-500
          pointer-events-none
        "
      />

      {/* Input */}

      <input
        type="text"
        placeholder="Search folders, customers..."
        value={value}
        onChange={(e) =>
          onChange(e.target.value)
        }
        className="
          w-full
          h-14
          pl-12
          pr-4

          rounded-2xl

          bg-white/5
          border
          border-white/10

          backdrop-blur-xl

          text-white
          placeholder:text-slate-500

          transition-all
          duration-300

          hover:border-violet-500/20

          focus:outline-none
          focus:border-violet-500/40
          focus:ring-4
          focus:ring-violet-500/10
        "
      />

      {/* Glow Effect */}

      <div
        className="
          pointer-events-none
          absolute
          inset-0
          rounded-2xl
          opacity-0
          transition-opacity
          duration-300
          bg-linear-to-r
          from-violet-500/5
          via-blue-500/5
          to-cyan-500/5
        "
      />
    </div>
  );
}