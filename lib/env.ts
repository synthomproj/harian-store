function getEnv(
  name:
    | "NEXT_PUBLIC_SUPABASE_URL"
    | "NEXT_PUBLIC_SUPABASE_ANON_KEY"
    | "SUPABASE_SERVICE_ROLE_KEY"
    | "PAYDIA_CLIENT_ID"
    | "PAYDIA_CLIENT_PRIVATE_KEY"
    | "PAYDIA_CLIENT_SECRET"
    | "PAYDIA_IS_PRODUCTION"
    | "PAYDIA_MERCHANT_ID"
    | "PAYDIA_CHANNEL_ID"
    | "PAYDIA_CALLBACK_URL"
    | "PAYDIA_PUBLIC_KEY"
    | "PAYDIA_STORE_ID"
    | "PAYDIA_TERMINAL_ID",
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

export function getSupabaseServiceRoleEnv() {
  return {
    url: getEnv("NEXT_PUBLIC_SUPABASE_URL"),
    serviceRoleKey: getEnv("SUPABASE_SERVICE_ROLE_KEY"),
  };
}

export function getPaydiaEnv() {
  const isProduction = getEnv("PAYDIA_IS_PRODUCTION") === "true";

  return {
    clientId: getEnv("PAYDIA_CLIENT_ID"),
    clientPrivateKey: getEnv("PAYDIA_CLIENT_PRIVATE_KEY").replace(/\\n/g, "\n"),
    clientSecret: getEnv("PAYDIA_CLIENT_SECRET"),
    isProduction,
    baseUrl: isProduction ? "https://api.paydia.id" : "https://api.paydia.co.id",
    merchantId: getEnv("PAYDIA_MERCHANT_ID"),
    channelId: getEnv("PAYDIA_CHANNEL_ID"),
    callbackUrl: getEnv("PAYDIA_CALLBACK_URL"),
    publicKey: getEnv("PAYDIA_PUBLIC_KEY").replace(/\\n/g, "\n"),
    storeId: process.env.PAYDIA_STORE_ID?.trim() || null,
    terminalId: process.env.PAYDIA_TERMINAL_ID?.trim() || null,
  };
}
