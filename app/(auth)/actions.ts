"use server";

import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export type AuthActionState = {
  error?: string;
};

function getSupabaseAuthMessage(message: string) {
  if (message.toLowerCase().includes("user already registered")) {
    return "Email ini sudah terdaftar. Silakan login atau gunakan email lain.";
  }

  if (message.toLowerCase().includes("password")) {
    return "Password tidak memenuhi syarat keamanan Supabase.";
  }

  return message;
}

function getStringValue(formData: FormData, key: string) {
  const value = formData.get(key);

  return typeof value === "string" ? value.trim() : "";
}

export async function loginAction(_: AuthActionState, formData: FormData): Promise<AuthActionState> {
  const email = getStringValue(formData, "email");
  const password = getStringValue(formData, "password");

  if (!email || !password) {
    return { error: "Email dan password wajib diisi." };
  }

  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    return { error: getSupabaseAuthMessage(error.message) };
  }

  redirect("/dashboard");
}

export async function registerAction(_: AuthActionState, formData: FormData): Promise<AuthActionState> {
  const name = getStringValue(formData, "name");
  const email = getStringValue(formData, "email");
  const password = getStringValue(formData, "password");

  if (!name || !email || !password) {
    return { error: "Nama, email, dan password wajib diisi." };
  }

  if (password.length < 8) {
    return { error: "Password minimal 8 karakter." };
  }

  const supabase = await createSupabaseServerClient();
  const redirectTo = `${process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"}/auth/callback?next=/dashboard`;

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: redirectTo,
      data: {
        full_name: name,
      },
    },
  });

  if (error) {
    return { error: getSupabaseAuthMessage(error.message) };
  }

  // When email verification is enabled, Supabase creates the user without
  // returning a usable session yet, so the user must verify first.
  if (!data.session) {
    redirect("/login?registered=1");
  }

  redirect("/dashboard");
}
