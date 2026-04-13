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
    <div className={`${widthClass} ${heightClass} overflow-hidden rounded-lg`}>
      <img src={imageUrl} alt="Instagram post" className="h-full w-full object-cover" />
    </div>
  );
}
