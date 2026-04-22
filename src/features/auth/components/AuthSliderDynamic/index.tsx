"use client";

import dynamic from "next/dynamic";
import type { AuthSliderPaginationVariant } from "../AuthSlider";

/**
 * Lazy-loads AuthSlider (Swiper.js) only when needed.
 * The slider panel is hidden on mobile (`hidden lg:block`), so deferring
 * Swiper's JS keeps it out of the critical path for mobile users.
 */
const AuthSliderLazy = dynamic(() => import("../AuthSlider"), {
  loading: () => (
    <div className="relative h-full min-h-0 w-full overflow-hidden bg-black" />
  ),
});

export type { AuthSliderPaginationVariant };
export default AuthSliderLazy;
