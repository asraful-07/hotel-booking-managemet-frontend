import { Home } from "lucide-react";

export default function GlobalLoading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#faf8f5] to-[#f5f0ea]">
      <div className="flex flex-col items-center gap-4">
        <div className="relative">
          <div className="w-16 h-16 rounded-full border-4 border-[#e8d9cc] border-t-[#caa05c] animate-spin" />
          <div className="absolute inset-0 flex items-center justify-center">
            <Home className="w-6 h-6 text-[#caa05c]" />
          </div>
        </div>
        <p className="text-sm text-[#ab8965] font-medium tracking-wide">
          Global Loading....
        </p>
      </div>
    </div>
  );
}
