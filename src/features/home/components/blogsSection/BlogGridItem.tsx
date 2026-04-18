interface BlogGridItemProps {
  imageUrl: string;
  badge: string;
}

export function BlogGridItem({ imageUrl, badge }: BlogGridItemProps) {
  return (
    <article className="relative h-[277px] w-[243px] overflow-hidden rounded-lg">
      <img src={imageUrl} alt={badge} className="h-full w-full object-cover" />
      <span className="absolute left-4 top-4 rounded-3xl bg-white px-2 py-1 text-xs font-medium leading-4 text-grey-700">
        {badge}
      </span>
    </article>
  );
}
