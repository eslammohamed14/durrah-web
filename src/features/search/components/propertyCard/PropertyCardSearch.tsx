export default function PropertyCardSearch({
  badge,
  title,
  tag,
  location,
  sqft,
  price,
}: {
  badge: string;
  title: string;
  tag: string;
  location: string;
  sqft: string;
  price: string;
}) {
  return (
    <article className="flex w-full max-w-[416px] flex-col overflow-hidden rounded-xl bg-white shadow-[0_0_24px_rgba(0,0,0,0.06)] ring-1 ring-black/[0.04]">
      <div className="relative aspect-[416/216] w-full bg-gradient-to-br from-grey-100 to-grey-200">
        <div className="absolute left-3 top-3">
          <span className="inline-flex items-center rounded-md bg-white/95 px-2.5 py-1 text-xs font-medium leading-[18px] text-text-dark shadow-sm ring-1 ring-black/[0.06]">
            {badge}
          </span>
        </div>
        <div className="absolute bottom-3 left-1/2 flex -translate-x-1/2 gap-2">
          {[0, 1, 2, 3].map((i) => (
            <span
              key={i}
              className={`size-2 rounded-full ${i === 0 ? "bg-white" : "bg-white/50"}`}
            />
          ))}
        </div>
        <button
          type="button"
          aria-label="Previous image"
          className="absolute left-2 top-1/2 flex size-[42px] -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-grey-800 shadow-md ring-1 ring-black/[0.06] transition hover:bg-white"
        >
          <ChevronLeftBold className="size-5" />
        </button>
        <button
          type="button"
          aria-label="Next image"
          className="absolute right-2 top-1/2 flex size-[42px] -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-grey-800 shadow-md ring-1 ring-black/[0.06] transition hover:bg-white"
        >
          <ChevronRightBold className="size-5" />
        </button>
      </div>
      <div className="flex flex-1 flex-col gap-3 p-4">
        <div className="flex flex-wrap items-start justify-between gap-2">
          <h3 className="text-lg font-semibold leading-[30px] text-text-dark">
            {title}
          </h3>
          <span className="rounded-md bg-primary-lavender-200 px-2 py-1 text-xs font-medium leading-[18px] text-primary-blue-400">
            {tag}
          </span>
        </div>
        <p className="flex items-center gap-1.5 text-sm leading-[22px] text-grey-600">
          <LocationPinIcon className="size-[18px] shrink-0 text-grey-600" />
          {location}
        </p>
        <p className="flex items-center gap-1.5 text-sm leading-[22px] text-grey-600">
          <ExpandIcon className="size-[18px] shrink-0 text-grey-600" />
          {sqft}
        </p>
        <p className="pt-1 text-base font-semibold text-primary-coral-500">
          {price}
        </p>
      </div>
    </article>
  );
}






function ChevronLeftBold({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M15 18l-6-6 6-6"
        stroke="currentColor"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
function ChevronRightBold({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M9 18l6-6-6-6"
        stroke="currentColor"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}


function ExpandIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 18 18" fill="none" aria-hidden>
      <path
        d="M11.25 3.75H14.25V6.75M14.25 3.75L9 9M6.75 14.25H3.75V11.25M3.75 14.25L9 9"
        stroke="currentColor"
        strokeWidth={1.2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function LocationPinIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 18 18" fill="none" aria-hidden>
      <path
        opacity={0.4}
        d="M9 9.75a2.25 2.25 0 100-4.5 2.25 2.25 0 000 4.5z"
        stroke="currentColor"
        strokeWidth={1.2}
      />
      <path
        d="M3.09 6.87a6.08 6.08 0 1111.82 0c.17.57.02 1.2-.42 1.64l-4.24 4.24a1.5 1.5 0 01-2.12 0L3.51 8.51a1.5 1.5 0 01-.42-1.64z"
        stroke="currentColor"
        strokeWidth={1.2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}