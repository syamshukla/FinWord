import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import MainNav from "@/components/layout/main-nav";
import { Container } from "@/components/layout/container";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "FIN WORD",
  description: "Wordle For Finance Bros",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <MainNav />
          <Container>{children}</Container>
        </ThemeProvider>
      </body>
    </html>
  );
}
