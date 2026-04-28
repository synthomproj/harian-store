"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";

type GoogleAuthButtonProps = {
  label: string;
};

function GoogleIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className="size-4">
      <path
        fill="#EA4335"
        d="M12 10.2v3.9h5.4c-.2 1.3-1.6 3.9-5.4 3.9-3.2 0-5.9-2.7-5.9-6s2.7-6 5.9-6c1.8 0 3 .8 3.7 1.5l2.5-2.4C16.6 3.6 14.5 2.7 12 2.7 6.9 2.7 2.8 6.8 2.8 12s4.1 9.3 9.2 9.3c5.3 0 8.8-3.7 8.8-8.9 0-.6-.1-1.1-.1-1.5H12Z"
      />
      <path fill="#34A853" d="M2.8 12c0 1.7.6 3.2 1.5 4.5l3.1-2.4c-.2-.6-.4-1.3-.4-2.1s.1-1.4.4-2.1l-3.1-2.4C3.4 8.8 2.8 10.3 2.8 12Z" />
      <path fill="#FBBC05" d="M12 21.3c2.5 0 4.6-.8 6.2-2.3l-3-2.4c-.8.6-1.8 1-3.2 1-2.5 0-4.7-1.7-5.4-4l-3.2 2.5c1.6 3.1 4.8 5.2 8.6 5.2Z" />
      <path fill="#4285F4" d="M18.2 19c1.8-1.7 2.6-4.1 2.6-6.6 0-.6-.1-1.1-.1-1.5H12v3.9h5.4c-.3 1.4-1.1 2.7-2.3 3.6l3.1 2.6Z" />
    </svg>
  );
}

export function GoogleAuthButton({ label }: GoogleAuthButtonProps) {
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  async function handleGoogleSignIn() {
    setError(null);
    setPending(true);

    const supabase = createSupabaseBrowserClient();
    const redirectTo = `${window.location.origin}/auth/callback?next=/dashboard`;
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo,
      },
    });

    if (error) {
      setError(error.message);
      setPending(false);
    }
  }

  return (
    <div className="space-y-3">
      {error ? (
        <div className="rounded-[1rem] border-4 border-black bg-[#ff8fab] px-4 py-3 text-sm font-medium text-black shadow-[6px_6px_0_0_#000]">
          {error}
        </div>
      ) : null}

      <Button type="button" variant="outline" size="lg" className="w-full bg-white" onClick={handleGoogleSignIn} disabled={pending}>
        <GoogleIcon />
        {pending ? "Menghubungkan..." : label}
      </Button>
    </div>
  );
}
