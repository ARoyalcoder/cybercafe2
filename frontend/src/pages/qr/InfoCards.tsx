import {
  Upload,
  ShieldCheck,
} from "lucide-react";

export default function InfoCards() {
  return (
    <div className="grid md:grid-cols-2 gap-6 mt-8">
      <div
        className="
          bg-white/5
          border
          border-white/10
          rounded-3xl
          p-6
        "
      >
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-blue-500/10 flex items-center justify-center">
            <Upload className="text-blue-400" />
          </div>

          <div>
            <p className="text-slate-400 text-sm">
              Upload Method
            </p>

            <h3 className="font-semibold text-lg text-white">
              QR + Direct Link
            </h3>
          </div>
        </div>
      </div>

      <div
        className="
          bg-white/5
          border
          border-white/10
          rounded-3xl
          p-6
        "
      >
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-green-500/10 flex items-center justify-center">
            <ShieldCheck className="text-green-400" />
          </div>

          <div>
            <p className="text-slate-400 text-sm">
              Security
            </p>

            <h3 className="font-semibold text-lg text-white">
              Secure Uploads
            </h3>
          </div>
        </div>
      </div>
    </div>
  );
}