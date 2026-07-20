import { Link } from "@tanstack/react-router";

export function NotFoundPage() {
  return (
    <>
      {/* Ambient glow */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary-brand/5 rounded-full blur-[150px]" />
      </div>

      <div className="flex min-h-screen items-center justify-center px-4">
        <div className="max-w-lg text-center">
          <h1
            className="text-[120px] md:text-[160px] font-medium leading-none tracking-tighter"
            style={{
              background: "linear-gradient(to bottom right, #38BDF8 0%, rgba(56,189,248,0.3) 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            404
          </h1>
          <h2 className="mt-4 text-[28px] font-medium text-eye-white">Page Not Found</h2>
          <p className="mt-4 text-[16px] text-eye-text leading-relaxed">
            The page you're looking for doesn't exist or has been moved.
          </p>
          <div className="mt-10 flex items-center justify-center gap-4">
            <Link
              to="/"
              className="luminous-btn-primary px-8 py-3 rounded-md font-medium text-[14px]"
            >
              Go Home
            </Link>
            <button
              onClick={() => window.history.back()}
              className="px-8 py-3 rounded-md font-medium text-[14px] text-eye-white border border-eye-border hover:border-primary-brand/50 transition-all"
            >
              Go Back
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
