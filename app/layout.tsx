
import React from 'react';
import './globals.css';

export const metadata = {
  title: "BloomBrain – AI Cognitive Growth for Curious Children",
  description: "BloomBrain is a magical studio where children use creative AI to build focus, memory, and emotional intelligence through playful exploration and nature discovery.",
  keywords: "children AI, cognitive development, focus for kids, educational AI, storytelling AI, child safety AI",
  openGraph: {
    title: "BloomBrain – Grow Smarter, Gently",
    description: "Creative AI studio for children aged 4-12 focused on cognitive and emotional development.",
    type: "website",
    url: "https://bloombrain.ai",
    siteName: "BloomBrain",
  },
  twitter: {
    card: "summary_large_image",
    title: "BloomBrain – AI Studio for Curious Minds",
    description: "Personalized AI-powered learning and creativity for children.",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-[#F8FAFC] text-slate-900 antialiased selection:bg-indigo-100 selection:text-indigo-900">
        {children}
      </body>
    </html>
  );
}
