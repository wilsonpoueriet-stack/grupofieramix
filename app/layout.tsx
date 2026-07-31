import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "GRUPO FIERAMIX.COM",
  description: "La red latina que mueve el mundo",
  metadataBase: new URL("https://fieramix.com"),
  openGraph: {
    title: "GRUPO FIERAMIX.COM",
    description: "La red latina que mueve el mundo",
    url: "https://fieramix.com",
    siteName: "GRUPO FIERAMIX.COM",
    locale: "es_DO",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}
