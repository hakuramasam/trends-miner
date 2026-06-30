import type { Metadata, Viewport } from "next";
import { Providers } from "@/components/providers";
import "./globals.css";

export const metadata: Metadata = {
  title: "Trends Mining Simulator | $TREND on Base",
  description:
    "Web browser trend mining game. Connect wallet via SIWE + WalletConnect, mine ORE from daily social veins, stake $TREND on Empire Builder.",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Trend Mine",
  },
};

export const viewport: Viewport = {
  themeColor: "#0052FF",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full bg-[#0a0a0f] font-sans text-zinc-100">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
