import "./globals.css";
import Script from "next/script";

export const metadata = {
  title: "Temenos Study",
  description: "Temenos Transact study and revision app.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        {children}
        {/* Puter.js — optional cloud text-to-speech (natural neural voices).
            Loaded lazily; the app falls back to the browser's built-in voice
            if this is unavailable. */}
        <Script src="https://js.puter.com/v2/" strategy="lazyOnload" />
      </body>
    </html>
  );
}
