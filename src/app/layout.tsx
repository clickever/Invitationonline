import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/common/Navbar";
import Footer from "@/components/common/Footer";

export const metadata: Metadata = {
  title: "InviteStudio - Digital Invitation Creation Platform",
  description:
    "Design and publish stunning, mobile-first digital event invitations for weddings, engagements, birthdays, anniversaries, and parties with live RSVP tracking.",
  keywords: [
    "digital invitation",
    "wedding invite maker",
    "rsvp tracker",
    "online invitation cards",
    "mobile invitations",
    "event invitations",
  ],
  openGraph: {
    title: "InviteStudio - Digital Invitation Platform",
    description: "Create, customize, and share interactive mobile-first digital invitations.",
    url: "https://invitestudio.app",
    siteName: "InviteStudio",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=0" />
      </head>
      <body className="min-h-screen flex flex-col antialiased selection:bg-amber-200 selection:text-amber-900">
        <Navbar />
        <main className="flex-1 flex flex-col">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
