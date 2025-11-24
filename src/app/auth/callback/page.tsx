"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import { getOrCreateUserProfile } from "@/services/users.service";

export default function AuthCallback() {
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    const handleAuth = async () => {
      let session = null;
      for (let i = 0; i < 10; i++) {
        const { data } = await supabase.auth.getSession();
        if (data.session) {
          session = data.session;
          break;
        }
        await new Promise((r) => setTimeout(r, 300)); 
      }

      if (!session?.user) {
        router.replace("/");
        router.refresh();
        return;
      }

      try {
        await getOrCreateUserProfile(session.user);
      } catch (err) {
        console.error("Erro ao criar perfil:", err);
      }

      router.replace("/projects");
      router.refresh();
    };

    handleAuth();
  }, [router, supabase]);

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
