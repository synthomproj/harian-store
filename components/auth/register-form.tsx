"use client";

import { useActionState } from "react";
import { type AuthActionState, registerAction } from "@/app/(auth)/actions";
import { AuthSubmitButton } from "@/components/auth/auth-submit-button";
import { GoogleAuthButton } from "@/components/auth/google-auth-button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const initialState: AuthActionState = {};

export function RegisterForm() {
  const [state, formAction] = useActionState(registerAction, initialState);

  return (
    <div className="space-y-4">
      <GoogleAuthButton label="Daftar dengan Google" />

      <div className="flex items-center gap-3">
        <div className="h-[2px] flex-1 bg-black" />
        <p className="text-xs font-black uppercase tracking-[0.18em] text-black/55">atau</p>
        <div className="h-[2px] flex-1 bg-black" />
      </div>

      <form action={formAction} className="space-y-4">
        {state.error ? (
          <div className="rounded-[1rem] border-4 border-black bg-[#ff8fab] px-4 py-3 text-sm font-medium text-black shadow-[6px_6px_0_0_#000]">
            {state.error}
          </div>
        ) : null}

        <div className="space-y-2">
          <Label htmlFor="name" className="font-black text-black">
            Nama
          </Label>
          <Input
            id="name"
            name="name"
            type="text"
            placeholder="Nama lengkap"
            autoComplete="name"
            className="h-11 bg-white placeholder:text-black/35 focus-visible:ring-black focus-visible:ring-offset-[#fffbef]"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="email" className="font-black text-black">
            Email
          </Label>
          <Input
            id="email"
            name="email"
            type="email"
            placeholder="nama@email.com"
            autoComplete="email"
            className="h-11 bg-white placeholder:text-black/35 focus-visible:ring-black focus-visible:ring-offset-[#fffbef]"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="password" className="font-black text-black">
            Password
          </Label>
          <Input
            id="password"
            name="password"
            type="password"
            placeholder="Minimal 8 karakter"
            autoComplete="new-password"
            className="h-11 bg-white placeholder:text-black/35 focus-visible:ring-black focus-visible:ring-offset-[#fffbef]"
          />
        </div>

        <AuthSubmitButton idleLabel="Daftar" pendingLabel="Membuat akun..." />
      </form>
    </div>
  );
}
