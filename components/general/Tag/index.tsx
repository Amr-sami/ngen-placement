import React from "react";
import Image from "next/image";

function Tag({ icon, alt, text }: { icon: string; text: string; alt: string }) {
  return (
    <div className="flex items-center gap-2 text-gray-dark text-xs">
      <Image src={icon} width={24} height={24} alt={alt} />
      <p>{text}</p>
    </div>
  );
}

export default Tag;
