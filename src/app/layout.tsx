import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Escape Ramp - The Fastest Way Off The Books",
  description: "The fastest way to migrate from QuickBooks Desktop to the cloud. Zero data loss guaranteed in 24 hours with AI-powered migration service.",
  keywords: "QuickBooks migration, QuickBooks Desktop, data migration, zero data loss, AI migration, cloud accounting",
  authors: [{ name: "Escape Ramp Team" }],
  creator: "Escape Ramp",
  publisher: "Escape Ramp",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://escaperamp.com'),
            openGraph: {
            title: "Escape Ramp - The Fastest Way Off The Books",
            description: "The fastest way to migrate from QuickBooks Desktop to the cloud. Zero data loss guaranteed.",
    url: 'https://escaperamp.com',
    siteName: 'Escape Ramp',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Escape Ramp - QuickBooks Migration Service',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
            twitter: {
            card: 'summary_large_image',
            title: "Escape Ramp - The Fastest Way Off The Books",
            description: "The fastest way to migrate from QuickBooks Desktop to the cloud. Zero data loss guaranteed.",
    images: ['/og-image.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'your-google-verification-code',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
