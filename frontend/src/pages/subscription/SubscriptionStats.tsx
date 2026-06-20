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
        },
        {
            label: "Uploads Used",
            value:
                usage.uploadLimit === -1
                    ? `${usage.uploadsUsed} / Unlimited`
                    : `${usage.uploadsUsed} / ${usage.uploadLimit}`,
        },
        {
            label: "Storage Used",
            value: `${(
                usage.storageUsed /
                1024 /
                1024
            ).toFixed(2)} MB`,
        },
        {
            label: "Remaining Uploads",
            value:
                usage.uploadLimit === -1
                    ? "∞"
                    : usage.uploadLimit -
                      usage.uploadsUsed,
        },
    ];

    return (
        <div className="grid gap-5 mt-8 md:grid-cols-2 xl:grid-cols-4">
            {stats.map((item) => (
                <div
                    key={item.label}
                    className="bg-white rounded-2xl p-6 shadow-sm border"
                >
                    <p className="text-sm text-gray-500">
                        {item.label}
                    </p>

                    <h3 className="text-2xl font-bold mt-2 capitalize">
                        {item.value}
                    </h3>
                </div>
            ))}
        </div>
    );
}