import durrahHomeJpg from "@/assets/images/durrah_home.webp";
import durrahLogo from "@/assets/images/durrah_logo.png";
import property1 from "@/assets/images/property1.webp";
import property2 from "@/assets/images/property2.webp";
import property3 from "@/assets/images/property3.webp";
import property4 from "@/assets/images/property4.webp";
import property5 from "@/assets/images/property5.webp";
import property6 from "@/assets/images/property6.webp";
import activity1 from "@/assets/images/activity1.webp";
import activity2 from "@/assets/images/activity2.webp";
import yachtShape from "@/assets/images/yacht_shape.png";
import durrahLogoBlue from "@/assets/images/durrah_logo_blue.png";
import homeDecorativeWave from "@/assets/images/home-decorative-wave.svg";
import authImage from "@/assets/images/auth_image.webp";

/** SVG imports are often a plain URL string; raster assets use StaticImageData with `.src`. */
function assetUrl(mod: string | { src: string }): string {
  return typeof mod === "string" ? mod : mod.src;
}

const images = {
  durrahHomeHero: durrahHomeJpg.src,
  durrahLogo: durrahLogo.src,
  property1: property1.src,
  property2: property2.src,
  property3: property3.src,
  property4: property4.src,
  property5: property5.src,
  property6: property6.src,
  activity1: activity1.src,
  activity2: activity2.src,
  yachtShape: yachtShape.src,
  durrahLogoBlue: durrahLogoBlue.src,
  authImage: authImage.src,
  homeDecorativeWave: assetUrl(homeDecorativeWave),
} as const;

export default images;
