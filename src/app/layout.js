import "./globals.css";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "VRNITSOLUTION",
  description:
    "Your gateway to digital success. We offer cutting-edge web development, Android app creation, and ecommerce marketing services to empower your business. Let us help you unleash your online potential and drive growth in the ever-evolving world of technology.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className} data-theme="light">
        {children}
      </body>
    </html>
  );
}
