import Image from "next/image";

interface BlogGridItemProps {
  imageUrl: string;
  badge: string;
}

/** Matches Figma `489:5399` — thumb cells 243×277, radius 8px, badge 16px inset. */
export function BlogGridItem({ imageUrl, badge }: BlogGridItemProps) {
  return (
    <article className="relative aspect-[243/277] w-full min-w-0 flex-1 overflow-hidden rounded-lg lg:aspect-auto lg:h-[277px]">
      <Image
        src={imageUrl}
        alt={badge}
        fill
        sizes="(max-width: 1023px) 46vw, 280px"
        className="object-cover"
      />
      <span className="absolute start-4 top-4 z-[1] flex h-6 items-center rounded-full bg-white px-2 py-1 text-xs font-medium leading-4 text-grey-700">
        {badge}
      </span>
    </article>
  );
}
