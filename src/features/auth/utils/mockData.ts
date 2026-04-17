import images from "@/constant/images";

/**
 * Mock auth visuals for UI work before Firebase and CMS wiring.
 * Replace or extend when real slider content is available.
 */
export const authVisualMock = {
  /** Primary hero image for the auth split-panel (Figma export). */
  sliderHeroSrc: images.authImage,
  sliderImages: [images.authImage, images.durrahHomeHero, images.property1],
  sliderTitleKey: "auth.layout.promoTitle",
  sliderSubtitleKey: "auth.layout.promoSubtitle",
  authLegalLinks: [
    { key: "faq", href: "#" },
    { key: "investments", href: "#" },
    { key: "terms", href: "#" },
    { key: "contact", href: "#" },
  ],
} as const;
