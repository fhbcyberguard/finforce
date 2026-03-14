import { cn } from "@/lib/utils";
import logoImg from "../assets/copia-de-logo-drowp-horizontal-3e587.png";

type LogoProps = {
  className?: string;
};

export function Logo({ className }: LogoProps) {
  return (
    <img
      src={logoImg}
      alt="Drowp"
      className={cn("h-8 w-auto", className)}
    />
  );
}