"use client";

import { createNavigation } from "next-intl/navigation";
import { SUPPORTED_LOCALES } from "@/config/i18n";

export const { Link, usePathname, useRouter, redirect } = createNavigation({
  locales: SUPPORTED_LOCALES,
});
