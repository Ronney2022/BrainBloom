
import React from 'react';
import Navbar from "../../components/layout/Navbar";
import Footer from "../../components/layout/Footer";

interface MarketingLayoutProps {
  children?: React.ReactNode;
  onLoginClick?: () => void;
}

export default function MarketingLayout({
  children,
  onLoginClick
}: MarketingLayoutProps) {
  return (
    <div className="flex flex-col min-h-screen bg-slate-50 text-slate-900 antialiased font-inter">
      <Navbar onLoginClick={onLoginClick} />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}
