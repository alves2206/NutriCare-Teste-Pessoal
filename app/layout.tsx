import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import { ThemeScript } from "@/components/theme/ThemeScript";
import "./globals.css";

export const metadata: Metadata = {
  title: "NutriCare",
  description: "Aplicação privada de acompanhamento nutricional pessoal.",
  manifest: "/manifest.webmanifest",
  applicationName: "NutriCare",
  appleWebApp: {
    capable: true,
    title: "NutriCare",
    statusBarStyle: "default"
  },
  icons: {
    icon: "/icon.svg",
    apple: "/icon.svg"
  }
};

export const viewport: Viewport = {
  themeColor: "#fff7f7",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover"
};

export default function RootLayout({
  children
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body>
        <ThemeScript />
        {children}
      </body>
    </html>
  );
}
