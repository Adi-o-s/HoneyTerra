"use client";

import { useActionState } from "react";
import Link from "next/link";
import { signInAction, type AuthState } from "@/lib/auth/actions";
import { Logo } from "@/components/store/logo";
import { Button } from "@/components/ui/button";

export default function LoginPage() {
  const [state, action, pending] = useActionState<AuthState, FormData>(signInAction, {});

  return (
    <div className="container-page flex justify-center py-16">
      <div className="w-full max-w-md rounded-3xl border border-line bg-paper p-8 shadow-[var(--shadow-soft)]">
        <div className="mb-6 flex flex-col items-center text-center">
          <Logo />
          <h1 className="mt-5 font-display text-3xl font-semibold">Welcome back</h1>
          <p className="mt-1 text-ink-soft">Sign in to track orders and check out faster.</p>
        </div>

        <form action={action} className="space-y-4">
          <Field label="Email" name="email" type="email" placeholder="you@email.com" />
          <Field label="Password" name="password" type="password" placeholder="••••••••" />
          {state.error && (
            <p className="rounded-xl bg-rose-50 px-4 py-2.5 text-sm text-rose-600">{state.error}</p>
          )}
          <Button type="submit" variant="primary" size="lg" className="w-full" disabled={pending}>
            {pending ? "Signing in…" : "Sign in"}
          </Button>
        </form>

        <p className="mt-6 text-center text-sm text-ink-soft">
          New to HoneyTerra?{" "}
          <Link href="/signup" className="font-semibold text-brand-700 hover:underline">
            Create an account
          </Link>
        </p>
      </div>
    </div>
  );
}

function Field({ label, name, type, placeholder }: { label: string; name: string; type: string; placeholder: string }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-medium text-ink-soft">{label}</span>
      <input
        name={name}
        type={type}
        required
        placeholder={placeholder}
        className="h-11 w-full rounded-xl border border-line bg-paper px-4 text-sm outline-none transition-colors focus:border-brand-500 focus:ring-2 focus:ring-brand-100"
      />
    </label>
  );
}
