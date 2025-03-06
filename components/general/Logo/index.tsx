import React from "react";
import Image from "next/image";
function Logo({ width, height, classNames }: { width: number; height: number, classNames?: string }) {
  return (
    <Image
      src="/assets/images/logos/ngen-logo.svg"
      width={width}
      height={height}
      alt="NGen Logo"
      className={classNames}
    />
  );
}

export default Logo;
