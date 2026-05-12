import type { Metadata } from "next";
import { Geist, Geist_Mono, Inter, Nunito_Sans } from "next/font/google";
import "./globals.css";
import Header from "@/components/ui/navbar";
import Footer from "@/components/footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const inter = Inter({ variable: "--font-inter", subsets: ["latin"] })
const nunito = Nunito_Sans({ variable: "--font-nunito-sans", subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Zipdrift — download multiple images at once from a pdf file",
  description: "Batch Image Download — download multiple images at once from a pdf file",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${inter.variable} ${nunito.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col font-nunito">
       <Header/>
        
        {children}
        
      <Footer/>
      </body>
    </html>
  );
}
