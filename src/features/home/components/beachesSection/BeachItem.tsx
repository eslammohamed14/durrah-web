import { Link } from "@/navigation";
import { ArrowRightIcon } from "@/assets/icons";

export interface BeachItemData {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  href: string;
  exploreLabel?: string;
}

export interface BeachItemProps {
  item: BeachItemData;
  isActive: boolean;
  distanceFromActive?: number;
}

export function BeachItem({
  item,
  isActive,
  distanceFromActive = 2,
}: BeachItemProps) {
  const isAdjacent = distanceFromActive === 1;

  const containerStateClasses = isActive
    ? "z-30 h-[411px] w-[318px] border-white scale-100 blur-0 opacity-100 shadow-[0_14px_32px_rgba(42,47,115,0.16)]"
    : isAdjacent
      ? "z-20 h-[383px] w-[296px] border-white/95 blur-[2px] opacity-100"
      : "z-10 h-[355px] w-[274px] border-white/90 blur-[2.8px] opacity-100";

  return (
    <div
      className={`relative overflow-hidden rounded-lg border-4 transition-all duration-300 ${containerStateClasses}`}
      style={{
        backgroundImage: `url('${item.imageUrl}')`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
      role="img"
      aria-label={item.name}
    >
      {isActive && (
        <>
          <div className="absolute inset-x-0 bottom-0 h-[294px] bg-gradient-to-t from-black/60 to-transparent" />
          <div className="absolute flex flex-row justify-between items-center left-3 right-3 top-[285px] rounded-2xl bg-white/10 p-3 backdrop-blur-[9px]">
            <div className="max-w-[226px]">
              <p className="text-base font-semibold leading-[1.5] text-white">
                {item.name}
              </p>
              <p className="mt-1  text-xs leading-[1.5] text-white">
                {item.description}
              </p>
            </div>
            <Link
              href={"/"} //item.href
              className="mt-2 inline-flex items-center gap-2 text-xs font-medium text-white"
            >
              <ArrowRightIcon className="h-[24px] w-[24px]" />
            </Link>
          </div>
        </>
      )}
    </div>
  );
}
