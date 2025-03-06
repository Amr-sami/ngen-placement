import React from "react";

export function H2({
  children,
  classNames,
}: Readonly<{
  children: React.ReactNode;
  classNames?: string 
}>) {
  return (
    <h2 className={`text-2xl lg:text-5xl font-protestRiot text-purple-dark ${classNames}`}>
      {children}
    </h2>
  );
}
