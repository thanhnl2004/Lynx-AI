"use server";

import { createClient } from "@/utils/supabase/server";
import type { Provider } from "@supabase/supabase-js";
import { redirect } from "next/navigation";

const signInWithProvider = async (provider: Provider) => {
  const supabase = await createClient();
  const origin = process.env.SITE_URL || "http://localhost:3000";

  const authCallbackUrl = `${origin}/auth/callback`;

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider,
    options: {
      redirectTo: authCallbackUrl,
    },
  });

  if (error) {
    throw new Error(error.message);
  }

  redirect(data.url);
}

const signOut = async () => {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/");
}

export { signInWithProvider, signOut };