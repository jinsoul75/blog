import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "next-themes";
import { ThemeToggle } from "@/components/ThemeToggle";
import Link from "next/link";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "jinsoul — 배우고, 만들고, 기록하는 일",
    template: "%s · jinsoul",
  },
  description: "개발하며 배운 것과 일상에서 발견한 생각을 기록합니다.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange={false}
        >
          <a className="skip-link" href="#main-content">
            본문으로 건너뛰기
          </a>
          <header className="site-header">
            <Link className="wordmark" href="/">
              Jinsoul blog
            </Link>
            <ThemeToggle />
          </header>
          {children}
          <footer className="site-footer">
            <Link className="wordmark" href="/">
              jinsoul<span>.</span>
            </Link>
            <p>조금씩 배우고, 꾸준히 기록합니다.</p>
            <span>© {new Date().getFullYear()} jinsoul</span>
          </footer>
        </ThemeProvider>
      </body>
    </html>
  );
}
