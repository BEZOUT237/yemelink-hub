import { Link } from "@tanstack/react-router";
import logoImg from "@/assets/yemelink-logo.png";

export function Logo({ size = 40 }: { size?: number }) {
  return (
    <Link to="/" className="group flex items-center gap-3">
      <div className="relative">
        <div
          className="absolute inset-0 rounded-xl bg-primary/40 blur-xl opacity-60 group-hover:opacity-100 transition-opacity"
          aria-hidden
        />
        <img
          src={logoImg}
          alt="YEMELINK logo"
          width={size}
          height={size}
          className="relative rounded-xl"
        />
      </div>
      <div className="flex flex-col leading-none">
        <span className="font-display font-bold tracking-tight text-foreground text-lg">
          YEMELINK
        </span>
        <span className="text-[10px] text-primary/80 tracking-widest uppercase">
          Tech Hub
        </span>
      </div>
    </Link>
  );
}
