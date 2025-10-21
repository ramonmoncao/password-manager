"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";

export default function AuthCallback() {
  const router = useRouter();
  const supabase = createClient();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const handleAuth = async () => {

      const {
        data: { session },
        error,
      } = await supabase.auth.getSession();

      if (error || !session?.user) {
        router.replace("/");
        router.refresh();
        return;
      }
      router.replace("/projects");
      router.refresh();
    };

    handleAuth();
  }, [router, supabase]);

  if (!loading) return null;

  return (
    <div className="flex h-screen items-center justify-center">
      <div className="text-center">
        <p className="text-[var(--color-text-1)] text-xl font-bold mb-4">
          Carregando...
        </p>
        <div className="w-16 h-16 border-4 border-t-[var(--color-primary-1)] border-gray-200 rounded-full animate-spin mx-auto"></div>
      </div>
    </div>
  );
}
