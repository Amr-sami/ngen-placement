import Link from "next/link";
import React from "react";

function Button({
  children,
  href,
  variant,
  takeFullWidth = false,
  classNames,
  isTargetBlank,
}: Readonly<{
  children: React.ReactNode;
  href: string;
  classNames?: string;
  variant: "primary" | "secondary";
  takeFullWidth?: boolean;
  isTargetBlank?: boolean;
}>) {
  return (
    <div>
      <Link
        href={href}
        target={isTargetBlank ? "_blank" : "_self"}
        className={`px-4 py-2 rounded-lg transition-colors duration-300 ease-linear ${
          variant === "primary"
            ? "bg-pumpkin text-white font-bold hover:bg-white hover:text-pumpkin"
            : "bg-white text-pumpkin hover:bg-pumpkin hover:text-white border border-pumpkin"
        }
        ${takeFullWidth ? "block w-full text-center" : ""} ${classNames}`}
      >
        {children}
      </Link>
    </div>
  );
}

export default Button;
