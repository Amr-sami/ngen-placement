import Link from "next/link";
import React from "react";
import { cn } from "@/lib/utils";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  href?: string;
  variant: "primary" | "secondary";
  takeFullWidth?: boolean;
  isTargetBlank?: boolean;
  classNames?: string;
}

const Button = React.forwardRef<HTMLElement, ButtonProps>(
  (
    {
      children,
      href,
      variant,
      takeFullWidth = false,
      classNames,
      isTargetBlank,
      className,
      ...props
    },
    ref
  ) => {
    const baseStyles =
      "inline-flex items-center justify-center px-4 py-2 rounded-lg transition-colors duration-300 ease-linear font-bold disabled:opacity-50 disabled:pointer-events-none";

    const variantStyles = {
      primary: "bg-pumpkin text-white hover:bg-white hover:text-pumpkin",
      secondary:
        "bg-white text-pumpkin hover:bg-pumpkin hover:text-white border border-pumpkin",
    };

    const combinedClassName = cn(
      baseStyles,
      variantStyles[variant],
      takeFullWidth && "w-full",
      className, // Allow passing standard className prop
      classNames // Keep legacy classNames prop working
    );

    if (href) {
      return (
        <Link
          href={href}
          target={isTargetBlank ? "_blank" : "_self"}
          className={combinedClassName}
        // We can't easily pass the ref to Link's underlying a tag without more complex handling,
        // but for now this covers the main use case.
        >
          {children}
        </Link>
      );
    }

    return (
      <button
        ref={ref as React.Ref<HTMLButtonElement>}
        className={combinedClassName}
        {...props}
      >
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";

export default Button;

