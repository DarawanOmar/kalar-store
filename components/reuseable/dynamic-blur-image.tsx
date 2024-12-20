import sharp from "sharp";
import Image from "next/image";
import React from "react";

type Props = {
  src: string;
  alt: string;
  height?: number;
  width?: number;
  className?: string;
};

async function fetchAndGenerateBase64(url: string) {
  const response = await fetch(url);
  const buffer = await response.arrayBuffer();
  const resizedImageBuffer = await sharp(Buffer.from(buffer))
    .resize(10)
    .toBuffer();

  return `data:image/jpeg;base64,${resizedImageBuffer.toString("base64")}`;
}

async function DynamicImageBuler({
  alt,
  src,
  height,
  width,
  className,
}: Props) {
  const blurDataUrl = await fetchAndGenerateBase64(src);
  return (
    <Image
      src={src}
      alt={alt}
      fill
      className={className}
      height={height}
      width={width}
      sizes="70vw"
      quality={100}
      placeholder="blur"
      blurDataURL={blurDataUrl}
    />
  );
}

export default DynamicImageBuler;
