import "./globals.css";

export const metadata = {
  title: "Temenos Study",
  description: "Temenos Transact study and revision app.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
