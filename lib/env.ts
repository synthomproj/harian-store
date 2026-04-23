function getEnv(
  name:
    | "NEXT_PUBLIC_SUPABASE_URL"
    | "NEXT_PUBLIC_SUPABASE_ANON_KEY"
    | "PAYDIA_API_URL"
    | "PAYDIA_API_KEY"
    | "PAYDIA_WEBHOOK_SECRET",
) {
  const value = process.env[name];

  if (!value) {
    throw new Error(`Missing environment variable: ${name}`);
  }

  return value;
}

export function getSupabaseEnv() {
  return {
    url: getEnv("NEXT_PUBLIC_SUPABASE_URL"),
    anonKey: getEnv("NEXT_PUBLIC_SUPABASE_ANON_KEY"),
  };
}

export function getPaydiaEnv() {
  return {
    apiUrl: getEnv("PAYDIA_API_URL"),
    apiKey: getEnv("PAYDIA_API_KEY"),
    webhookSecret: getEnv("PAYDIA_WEBHOOK_SECRET"),
  };
}
