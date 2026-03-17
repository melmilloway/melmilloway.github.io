import type { Metadata } from "next";
import { Instrument_Serif, Comme } from "next/font/google";
import "./globals.css";
import CursorDot from "@/components/CursorDot";

const instrumentSerif = Instrument_Serif({
  variable: "--font-instrument-serif",
  subsets: ["latin"],
  weight: ["400"],
  style: ["normal", "italic"],
});

const comme = Comme({
  variable: "--font-comme",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
});

export const metadata: Metadata = {
  title: "Mel Milloway | Learning Strategist & People Leader",
  description:
    "I create and lead learning systems that drive results at any scale. Previously at Amazon, leading teams that impacted more than 1 million employees.",
  openGraph: {
    title: "Mel Milloway | Learning Strategist & People Leader",
    description:
      "I create and lead learning systems that drive results at any scale.",
    url: "https://melmilloway.github.io",
    siteName: "Mel Milloway",
    locale: "en_US",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${instrumentSerif.variable} ${comme.variable}`}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <CursorDot />
        {children}
        <footer className="py-8 border-t border-ink/8">
          <div className="max-w-[1400px] mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-2">
            <p className="font-sans text-muted text-[14px]">
              &copy; Melissa Milloway
            </p>
            <p className="font-sans text-muted text-[14px]">
              Made with{" "}
              <span aria-label="love" role="img">
                ♥
              </span>{" "}
              in Seattle
            </p>
          </div>
        </footer>
      </body>
    </html>
  );
}
