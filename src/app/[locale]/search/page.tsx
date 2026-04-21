import type { Metadata } from "next";
import SearchPage from "@/features/search/pages/search";

export const dynamic = "force-dynamic";
export const metadata: Metadata = {
  title: "Search Properties | Durrah",
  description:
    "Search and filter properties across all categories — rent, buy, shops, and activities at Durrah Al-Arus.",
  openGraph: {
    title: "Search Properties | Durrah",
    description:
      "Search and filter properties across all categories — rent, buy, shops, and activities at Durrah Al-Arus.",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Search Properties | Durrah",
    description:
      "Search and filter properties across all categories — rent, buy, shops, and activities at Durrah Al-Arus.",
  },
};
export default SearchPage;
