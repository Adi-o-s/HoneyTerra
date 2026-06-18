"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle2 } from "lucide-react";

/** Transient "saved" confirmation. Shown when ?saved is present, then it
 *  auto-hides and cleans the URL so a refresh doesn't re-show it. */
export function SavedToast({ show, message = "Changes saved" }: { show: boolean; message?: string }) {
  const router = useRouter();
  const [visible, setVisible] = useState(show);

  useEffect(() => {
    if (!show) return;
    const t = setTimeout(() => {
      setVisible(false);
      router.replace("/admin/products");
    }, 2800);
    return () => clearTimeout(t);
  }, [show, router]);

  if (!visible) return null;
  return (
    <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2 rounded-full bg-brand-700 px-5 py-3 text-sm font-semibold text-white shadow-[var(--shadow-lift)]">
      <CheckCircle2 className="h-5 w-5 text-honey-300" /> {message}
    </div>
  );
}
