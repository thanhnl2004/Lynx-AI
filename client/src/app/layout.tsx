import type { Metadata } from "next";
import { Figtree } from "next/font/google";
import "@/styles/globals.css";
import { createClient } from "@/utils/supabase/server";
import { AuthProvider } from "@/contexts/auth-context";
import { SidebarLayout } from "@/layouts/sidebar-layout";
import { QueryProvider } from "@/providers/query-provider";

const font = Figtree({
  weight: ['400'],
  subsets: ['latin'],
  display: 'auto',
})


export const metadata: Metadata = {
  title: "Lynx AI",
  description: "An AI that creates agentic workflows with your favourite tools.",
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
        className={`${font.className}`}
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
