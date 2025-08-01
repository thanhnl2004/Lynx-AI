import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "@/styles/globals.css";
import { createClient } from "@/utils/supabase/server";
import { AuthProvider } from "@/components/contexts/auth-context";
import { SidebarLayout } from "@/components/layouts/sidebar-layout";
import { QueryProvider } from "@/components/providers/query-provider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Lynx Agent",
  description: "Lynx Agent",
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
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <QueryProvider>
          <AuthProvider user={user}>
            {user ? (
              <SidebarLayout>{children}</SidebarLayout>
            ) : (
              <>{children}</>
            )}
          </AuthProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
