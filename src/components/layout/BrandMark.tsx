export function BrandMark({ className = "" }: { className?: string }) {
  return (
    <span className={`flex items-center gap-3 text-eye-white ${className}`}>
      <img src="/favicon.png" alt="EyeX Logo" className="h-10 w-10 object-contain" />
       <span className="font-display font-medium text-[15px] tracking-tight">
         EyeX Technologies
       </span>
    </span>
  );
}
