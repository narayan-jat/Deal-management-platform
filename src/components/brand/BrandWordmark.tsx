import { Link } from "react-router-dom";

type BrandWordmarkProps = {
  /** Use when the wordmark sits on a dark background */
  variant?: "default" | "onDark";
  className?: string;
  to?: string;
};

/**
 * Text-based logo — replaces raster brand marks for a neutral "Deal Management" identity.
 */
export function BrandWordmark({
  variant = "default",
  className = "",
  to = "/",
}: BrandWordmarkProps) {
  const color =
    variant === "onDark"
      ? "text-white hover:text-white/90"
      : "text-brand-primary hover:text-brand-primary/90";

  const inner = (
    <span
      className={`font-inter text-lg font-bold tracking-tight sm:text-xl ${color} ${className}`}
    >
      Deal Management
    </span>
  );

  if (to) {
    return (
      <Link to={to} className="inline-flex items-center focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary/40 rounded">
        {inner}
      </Link>
    );
  }

  return <span className="inline-flex items-center">{inner}</span>;
}
