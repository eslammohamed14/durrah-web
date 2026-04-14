import Link from "next/link";
import { ArrowRightIcon } from "@/assets/icons";

export interface ActivityItemProps {
  /** Background image URL — falls back to a gradient placeholder when omitted */
  imageUrl?: string;
  imageAlt?: string;
  /** When true, renders the name / description / explore overlay */
  featured?: boolean;
  name?: string;
  description?: string;
  href?: string;
  exploreLabel?: string;
  className?: string;
  onClick?: () => void;
}

export function ActivityItem({
  imageUrl,
  imageAlt = "",
  featured = false,
  name,
  description,
  href = "/", //search?category=activity
  exploreLabel = "Explore",
  className = "",
  onClick,
}: ActivityItemProps) {
  return (
    <div
      className={`relative h-full w-full overflow-hidden rounded-2xl ${className}`}
      style={
        imageUrl
          ? {
              backgroundImage: `url('${imageUrl}')`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }
          : undefined
      }
      role={imageUrl ? "img" : undefined}
      aria-label={imageUrl ? imageAlt : undefined}
      onClick={onClick}
    >
      {/* Gradient placeholder shown when no real image is supplied */}
      {!imageUrl && (
        <div className="absolute inset-0 bg-gradient-to-br from-blue-400 to-cyan-600" />
      )}

      {featured && (
        <>
          {/* Bottom gradient scrim */}
          <div className="absolute  bottom-0 left-0 right-0 h-[294px] bg-gradient-to-t from-black/60 to-transparent" />

          {/* Content overlay */}
          <div className="absolute flex flex-row items-end justify-between bottom-6 left-6 right-6">
            <div>
              {name && <p className="text-xl font-medium text-white">{name}</p>}
              {description && (
                <p className="mt-2 max-w-[409px] text-sm text-white/90">
                  {description}
                </p>
              )}
            </div>
            <Link
              href={href}
              className="shrink-0 inline-flex items-center gap-2 rounded-lg border border-white px-6 py-4 text-base font-medium text-white transition-colors hover:bg-white/10"
            >
              {exploreLabel}
              <ArrowRightIcon className="h-6 w-6" />
            </Link>
          </div>
        </>
      )}
    </div>
  );
}
