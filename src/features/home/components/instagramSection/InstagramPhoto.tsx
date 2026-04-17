import Image from "next/image";

interface InstagramPhotoProps {
  imageUrl: string;
  widthClass: string;
  heightClass: string;
}

export function InstagramPhoto({
  imageUrl,
  widthClass,
  heightClass,
}: InstagramPhotoProps) {
  return (
    <div
      className={`${widthClass} ${heightClass} relative overflow-hidden rounded-lg`}
    >
      <Image
        src={imageUrl}
        alt="Instagram post"
        fill
        loading="lazy"
        sizes="(max-width: 768px) 100vw, 33vw"
        className="object-cover"
      />
    </div>
  );
}
