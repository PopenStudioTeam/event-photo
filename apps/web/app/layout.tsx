import type { Metadata } from "next";
import {
  Cormorant_Garamond,
  Fredoka,
  Nunito_Sans,
  Playfair_Display,
} from "next/font/google";
import "./globals.css";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { THEME_STORAGE_KEY } from "@/lib/theme";
import { ThemeProvider } from "@/components/theme-provider";
import { SupportWidget } from "@/components/support-widget";

const fredoka = Fredoka({
  subsets: ["latin"],
  variable: "--font-heading",
  display: "swap",
});

const nunitoSans = Nunito_Sans({
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
});

const playfairDisplay = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
});

const cormorantGaramond = Cormorant_Garamond({
  subsets: ["latin"],
  variable: "--font-script",
  style: ["normal", "italic"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Event Photo",
  description: "Collect event photos from guests with one private link",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      data-scroll-behavior="smooth"
      suppressHydrationWarning
      className={`${fredoka.variable} ${nunitoSans.variable} ${playfairDisplay.variable} ${cormorantGaramond.variable}`}
    >
      <body className="min-h-full bg-background font-sans text-foreground antialiased">
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem("${THEME_STORAGE_KEY}")||"system";var d=t==="dark"||(t==="system"&&window.matchMedia("(prefers-color-scheme: dark)").matches);document.documentElement.classList.toggle("dark",d);}catch(e){}})();`,
          }}
        />
        <ThemeProvider>
          <GoogleOAuthProvider
            clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!}
          >
            {children}
            <SupportWidget />
          </GoogleOAuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}