export function BrandMark({ className = "" }: { className?: string }) {
  return (
    <span className={`flex items-center gap-3 text-eye-white ${className}`}>
      <img src="/logo.png" alt="EyeX Logo" className="h-7 w-7 rounded-[6px] object-cover bg-white" />
      <span className="font-display font-medium text-[15px] tracking-tight leading-none">
        EyeX <span className="text-eye-text font-light">Technologies</span>
      </span>
    </span>
  );
}
