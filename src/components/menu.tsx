"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LogOut,
  FolderKanban,
  UserPlus,
  FilePlus2,
  ClipboardList,
  UserCheck,
  LockIcon,
} from "lucide-react";
import { useState } from "react";
import { createClient } from "@/utils/supabase/client";

export default function Menu() {
  const pathname = usePathname();
  const router = useRouter();
  const supabase = createClient();
  const [loading, setLoading] = useState(false);

  const nav = [
    { href: "/projects", label: "Meus Projetos", icon: FolderKanban },
    { href: "/request-acess", label: "Solicitar Acesso", icon: LockIcon },
    { href: "/requests", label: "Gerenciar Solicitações", icon: UserCheck },
    { href: "/my-requests", label: "Minhas Solicitações", icon: ClipboardList },
    { href: "/request-user", label: "Solicitar Usuário", icon: UserPlus },
    { href: "/request-project", label: "Solicitar Projeto", icon: FilePlus2 },
  ];

  const isActive = (href: string) => pathname?.startsWith(href);

  const handleLogout = async () => {
    try {
      setLoading(true);
      await supabase.auth.signOut();
      router.replace("/");
      router.refresh();
    } finally {
      setLoading(false);
    }
  };

  return (
    <aside className="fixed justify-center left-0 top-0 h-screen w-60 bg-[var(--color-box-1)] flex flex-col justify-between">
      <nav className="px-0 ">
        <ul className="w-full m-0 p-0 list-none">
          {nav.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.href);
            return (
              <li key={item.href} className="w-full">
                <Link
                  href={item.href}
                  aria-current={active ? "page" : undefined}
                  className={[
                    "flex items-center gap-3 px-4 py-3 text-sm font-medium select-none transition-colors w-full",
                    active
                      ? "bg-[var(--color-box-3)] text-[var(--color-primary-1)]"
                      : "text-[var(--color-text-1)] hover:bg-[var(--color-box-2)]",
                  ].join(" ")}
                >
                  <Icon
                    className={[
                      "h-4 w-4 flex-shrink-0",
                      active
                        ? "text-[var(--color-primary-1)]"
                        : "text-[var(--color-text-3)]",
                    ].join(" ")}
                  />
                  <span className="flex-1">{item.label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="px-0 py-4 w-full">
        <div className="h-px bg-[var(--color-border)] my-3" />
        <button
          onClick={handleLogout}
          disabled={loading}
          className={[
            "flex items-center gap-3 px-4 py-3 text-sm font-medium select-none transition-colors w-full",
            "text-[var(--color-text-1)] hover:bg-[var(--color-box-2)] disabled:opacity-50 rounded-none cursor-pointer",
          ].join(" ")}
        >
          <LogOut className="h-4 w-4 text-[var(--color-text-3)] flex-shrink-0" />
          <span className="flex-1">{loading ? "Saindo..." : "Sair"}</span>
        </button>
        <div className="h-px bg-[var(--color-border)] my-3" />
      </div>
    </aside>
  );
}
