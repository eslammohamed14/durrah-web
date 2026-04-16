import type { ReactNode } from "react";
import "./globals.css";

export default function RootLayout({ children }: { children: ReactNode }) {
  // All real layout (html/body/lang/dir/providers) is handled inside src/app/[locale]/layout.tsx
  return children;
}

