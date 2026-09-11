"use client";
import Link from "next/link";

type Variant = "primary" | "outline" | "ghost";
type Size = "sm" | "md" | "lg";

interface ButtonProps {
  children: React.ReactNode;
  variant?: Variant;
  size?: Size;
  href?: string;
  onClick?: () => void;
  type?: "button" | "submit" | "reset";
  disabled?: boolean;
  className?: string;
  fullWidth?: boolean;
}

const BASE = "inline-flex items-center justify-center font-bold tracking-wide transition-all duration-200 cursor-pointer border-none rounded-lg";

const SIZES: Record<Size, string> = {
  sm: "px-4 py-2 text-xs",
  md: "px-6 py-3 text-sm",
  lg: "px-8 py-4 text-base",
};

const VARIANTS: Record<Variant, React.CSSProperties> = {
  primary: { background: "#1a5c2a", color: "white" },
  outline: { background: "transparent", color: "#1a5c2a", border: "1px solid #1a5c2a" },
  ghost:   { background: "transparent", color: "#6b7280" },
};

const HOVER: Record<Variant, { bg: string; revert: string }> = {
  primary: { bg: "#0d9e72", revert: "#1a5c2a" },
  outline: { bg: "#0d9e72", revert: "transparent" },
  ghost:   { bg: "#e5e7eb", revert: "transparent" },
};

export default function Button({
  children, variant = "primary", size = "md",
  href, onClick, type = "button", disabled, className = "", fullWidth,
}: ButtonProps) {
  const cls = `${BASE} ${SIZES[size]} ${fullWidth ? "w-full" : ""} ${className}`;
  const style = VARIANTS[variant];

  const hoverHandlers = {
    onMouseEnter: (e: React.MouseEvent<HTMLElement>) => {
      (e.currentTarget as HTMLElement).style.background = HOVER[variant].bg;
      if (variant === "outline") (e.currentTarget as HTMLElement).style.color = "white";
    },
    onMouseLeave: (e: React.MouseEvent<HTMLElement>) => {
      (e.currentTarget as HTMLElement).style.background = HOVER[variant].revert;
      if (variant === "outline") (e.currentTarget as HTMLElement).style.color = "#1a5c2a";
    },
  };

  if (href) {
    return (
      <Link href={href} className={cls} style={style} {...hoverHandlers}>
        {children}
      </Link>
    );
  }

  return (
    <button type={type} onClick={onClick} disabled={disabled} className={cls} style={style} {...hoverHandlers}>
      {children}
    </button>
  );
}
