"use client";

import { useActionState } from "react";
import Link from "next/link";
import { CheckCircle2 } from "lucide-react";
import { signUpAction, type AuthState } from "@/lib/auth/actions";
import { Logo } from "@/components/store/logo";
import { Button } from "@/components/ui/button";

export default function SignupPage() {
  const [state, action, pending] = useActionState<AuthState, FormData>(signUpAction, {});

  return (
    <div className="container-page flex justify-center py-16">
      <div className="w-full max-w-md rounded-3xl border border-line bg-paper p-8 shadow-[var(--shadow-soft)]">
        <div className="mb-6 flex flex-col items-center text-center">
          <Logo />
          <h1 className="mt-5 font-display text-3xl font-semibold">Create your account</h1>
          <p className="mt-1 text-ink-soft">Save your details and track every order.</p>
        </div>

        {state.message ? (
          <div className="flex flex-col items-center gap-3 rounded-2xl bg-brand-50 p-6 text-center">
            <CheckCircle2 className="h-8 w-8 text-brand-600" />
            <p className="text-ink-soft">{state.message}</p>
            <Link href="/login" className="font-semibold text-brand-700 hover:underline">Go to sign in</Link>
          </div>
        ) : (
          <>
            <form action={action} className="space-y-4">
              <Field label="Full name" name="fullName" type="text" placeholder="Priya Sharma" />
              <Field label="Email" name="email" type="email" placeholder="you@email.com" />
              <Field label="Password" name="password" type="password" placeholder="At least 6 characters" />
              {state.error && (
                <p className="rounded-xl bg-rose-50 px-4 py-2.5 text-sm text-rose-600">{state.error}</p>
              )}
              <Button type="submit" variant="primary" size="lg" className="w-full" disabled={pending}>
                {pending ? "Creating account…" : "Create account"}
              </Button>
            </form>
            <p className="mt-6 text-center text-sm text-ink-soft">
              Already have an account?{" "}
              <Link href="/login" className="font-semibold text-brand-700 hover:underline">Sign in</Link>
            </p>
          </>
        )}
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
