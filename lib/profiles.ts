import type { User } from "@supabase/supabase-js";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";

function getDisplayName(user: User) {
  const fullName = user.user_metadata?.full_name;

  if (typeof fullName === "string" && fullName.trim()) {
    return fullName.trim();
  }

  const emailName = user.email?.split("@")[0]?.trim();

  return emailName || "User";
}

export async function ensureProfileForUser(user: User) {
  const supabase = createSupabaseAdminClient();

  const { data: existingProfile } = await supabase
    .from("profiles")
    .select("user_id")
    .eq("user_id", user.id)
    .maybeSingle();

  if (existingProfile) {
    return existingProfile;
  }

  const { data, error } = await supabase
    .from("profiles")
    .insert({
      user_id: user.id,
      email: user.email ?? "",
      full_name: getDisplayName(user),
    })
    .select("user_id")
    .single();

  if (error) {
    throw error;
  }

  return data;
}
