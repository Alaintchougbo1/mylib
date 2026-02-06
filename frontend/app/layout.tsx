import React, { ReactNode } from "react";
import type { Metadata } from "next";
import { Playfair_Display, Lexend } from "next/font/google";
import { AuthProvider } from "@/context/AuthContext";
import Navbar from "@/components/ui/Navbar";
import "./globals.css";

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-display",
  weight: ["400", "600", "700", "900"],
});

const lexend = Lexend({
  subsets: ["latin"],
  variable: "--font-body",
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Bibliothèque | Votre bibliothèque en ligne",
  description: "Explorez, empruntez et gérez vos livres préférés en toute simplicité.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html lang="fr" className={`${playfair.variable} ${lexend.variable}`}>
      <body className="antialiased min-h-screen flex flex-col">
        <AuthProvider>
          <Navbar />
          <main className="flex-grow">
            {children}
          </main>
        </AuthProvider>
      </body>
    </html>
  );
}
