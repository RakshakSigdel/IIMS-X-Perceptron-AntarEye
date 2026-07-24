import type { Metadata } from "next";
import { Manrope, Lora, IBM_Plex_Mono } from "next/font/google";
import "@/styles/index.css";
import { cn } from "@/lib/utils";
import { AppProviders } from "@/providers";

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-sans",
});

const lora = Lora({
  subsets: ["latin"],
  variable: "--font-serif",
});

const ibmPlexMono = IBM_Plex_Mono({
  weight: ["400", "500", "600"],
  subsets: ["latin"],
  variable: "--font-mono",
});

export const metadata: Metadata = {
  title: "AntarEye — AI-Assisted Retinal Disease Diagnosis",
  description:
    "AI-assisted retinal disease diagnosis platform for ophthalmologists. Detect Diabetic Retinopathy, Glaucoma, and Hypertensive Retinopathy from fundus images.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={cn(
        "h-full antialiased",
        manrope.variable,
        lora.variable,
        ibmPlexMono.variable,
        "font-sans"
      )}
    >
      <body className="min-h-full flex flex-col">
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  );
}
