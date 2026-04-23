import type { ReactNode } from "react";
import { QueryProvider } from "@/providers/QueryProvider";
import { validateProductionEnv } from "@/config/env";
import "./globals.css";

export default function RootLayout({ children }: { children: ReactNode }) {
  validateProductionEnv();

  return (
    <html lang="en">
      <body className="min-h-full flex flex-col" suppressHydrationWarning>
        <QueryProvider>{children}</QueryProvider>
      </body>
    </html>
  );
}

