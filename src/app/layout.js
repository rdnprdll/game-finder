import "./globals.css";
import { Bricolage_Grotesque, Newsreader } from "next/font/google";
import { AuthProvider } from "@/components/AuthProvider";

const bricolage = Bricolage_Grotesque({
  subsets: ["latin"],
  variable: "--font-bricolage",
  display: "swap",
});

const newsreader = Newsreader({
  subsets: ["latin"],
  style: ["normal", "italic"],
  variable: "--font-newsreader",
  display: "swap",
});

export const metadata = {
  title: "Game Finder",
  description: "Tell it what you like and get five games back, each with a note on why it fits.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${bricolage.variable} ${newsreader.variable}`}>
      <body className="bg-paper font-display text-ink antialiased">
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}