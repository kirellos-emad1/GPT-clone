import type { Metadata } from "next";
import "./globals.css";
import JotaiProvider from "@/providers/JotaiProvider";
import { ThemeProviderClient } from "@/providers/ThemeProvider";
import AuthContext from "@/context/AuthContext";
import { createClient } from "@/utils/supabase/server";

import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  return (
    <html suppressHydrationWarning lang="en">
      <body className={inter.className}>

        <JotaiProvider >
          <AuthContext id={user?.id}>
            <ThemeProviderClient>
              {children}
            </ThemeProviderClient>
          </AuthContext>
        </JotaiProvider>
      </body>
    </html>
  );
}
