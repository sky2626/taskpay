import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "TaskPay",
  description: "A human-task and rewards marketplace for verified work.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
