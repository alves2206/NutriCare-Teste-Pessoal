import type { HTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/utils/cn";

type CardProps = HTMLAttributes<HTMLDivElement> & {
  children: ReactNode;
};

export function Card({ children, className, ...props }: CardProps) {
  return (
    <section
      className={cn(
        "rounded-2xl border border-white/80 bg-white/88 p-4 shadow-soft backdrop-blur sm:p-5",
        className
      )}
      {...props}
    >
      {children}
    </section>
  );
}
