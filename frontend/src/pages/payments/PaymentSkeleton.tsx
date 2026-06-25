export default function PaymentSkeleton() {
  return (
    <div>
      {/* Stats Skeleton */}

      <div className="grid md:grid-cols-3 gap-6 mb-8">
        {[1, 2, 3].map((item) => (
          <div
            key={item}
            className="
              h-32
              rounded-3xl
              border
              border-white/10
              bg-white/5
              animate-pulse
            "
          />
        ))}
      </div>

      {/* Payment Cards Skeleton */}

      <div className="space-y-5">
        {[1, 2, 3, 4].map((item) => (
          <div
            key={item}
            className="
              h-40
              rounded-3xl
              border
              border-white/10
              bg-white/5
              animate-pulse
            "
          />
        ))}
      </div>
    </div>
  );
}