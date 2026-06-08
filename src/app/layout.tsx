import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Trade Buddy War Room",
  description: "Chat-first rule-based risk management and trading discipline room."
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
