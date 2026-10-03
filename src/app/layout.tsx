import type { Metadata } from "next";
import "@/styles/globals.css";

export const metadata: Metadata = {
  title: "Emons | Transport & logistics",
  icons: { icon: "/favicon.svg" },
  description: "Your forwarding company for transport, warehousing and logistics.",
  openGraph: {
    title: "Emons | Transport & logistics",
    description: "Reliable transport, warehousing and logistics solutions, shaped around your business.",
    type: "website"
  },
  twitter: {
    card: "summary_large_image",
    title: "Emons | Transport & logistics",
    description: "Reliable transport, warehousing and logistics solutions, shaped around your business."
  }
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
