import { GeistSans } from "geist/font/sans";
import "./globals.css";
import Sidebar from "../components/sidebar";
import Maindash from "@/components/mainhome";

const defaultUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : "http://localhost:3000";

export const metadata = {
  metadataBase: new URL(defaultUrl),
  title: "Marc Space",
  description: "The fastest way to build apps with Next.js and Supabase",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={GeistSans.className}>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </head>
      <body className="bg-transparent text-foreground flex">
        <div>
          <Sidebar />
        </div>
        <div className="flex-1 ml-4 ">
          <Maindash>{children}</Maindash>
        </div>
      </body>
    </html>
  );
}
