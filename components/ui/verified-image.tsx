"use client";

import Image from "next/image";
import { useState } from "react";
import { cn } from "@/lib/utils";

interface VerifiedImageProps extends React.HTMLAttributes<HTMLDivElement> {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
  aspectRatio?: "square" | "video" | "portrait" | number;
  objectFit?: "contain" | "cover";
}

export function VerifiedImage({
  src,
  alt,
  width,
  height,
  className,
  aspectRatio = "square",
  objectFit = "cover",
  ...props
}: VerifiedImageProps) {
  const [isLoading, setIsLoading] = useState(true);

  const aspectRatioClass = {
    square: "aspect-square",
    video: "aspect-video",
    portrait: "aspect-[3/4]",
  };

  return (
    <div
      className={cn(
        "overflow-hidden rounded-lg",
        typeof aspectRatio === "string" ? aspectRatioClass[aspectRatio] : `aspect-[${aspectRatio}]`,
        className
      )}
      {...props}
    >
      <Image
        src={src}
        alt={alt}
        width={width || 800}
        height={height || 800}
        className={cn(
          "transition-all duration-300",
          objectFit === "contain" ? "object-contain" : "object-cover",
          isLoading ? "scale-110 blur-lg" : "scale-100 blur-0"
        )}
        onLoadingComplete={() => setIsLoading(false)}
      />
    </div>
  );
}