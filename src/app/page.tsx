"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Button from "@/components/button";
import Modal from "@/components/modal";

export default function Login() {
  const supabase = createClient();
  const router = useRouter();
  const [checkingSession, setCheckingSession] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const checkSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (session?.user) {
        router.replace("/projects");
        router.refresh();
      } else {
        setCheckingSession(false);
      }
    };
    checkSession();
  }, []);

  const login = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage("");
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error || !data.user) {
        setErrorMessage("E-mail ou senha inválidos");
        setIsLoading(false);
        setIsOpen(true);
        return;
      }

      router.replace("/projects");
      router.refresh();
    } catch (err) {
      setErrorMessage("Erro inesperado. Tente novamente.");
      setIsLoading(false);
    }
  };

  const loginWithGoogle = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage("");

    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      });

      if (error) {
        setErrorMessage("Erro ao tentar entrar com Google.");
        setIsOpen(true);
        setIsLoading(false);
        return;
      }
    } catch (err) {
      setErrorMessage("Erro inesperado. Tente novamente.");
      setIsOpen(true);
    } finally {
      setIsLoading(false);
    }
  };

  if (checkingSession) {
    return null;
  }

  return (
    <div className="flex h-screen flex-col md:flex-row">
      <div className="relative hidden md:block md:w-1/2 h-screen">
        <Image
          src="/bg-login.png"
          alt="background"
          fill
          className="object-cover"
        />
      </div>
      <div className="flex w-full md:w-1/2  justify-center p-6">
        <div className="w-full max-w-md p-8 rounded-2xl md:shadow-none md:bg-transparent shadow-2xl bg-[var(--color-box-1)]">
          <h2 className="text-[var(--color-primary-1)] text-xl font-extrabold text-center mb-8 ">
            Acesse sua conta
          </h2>

          <form onSubmit={login}>
            <label className="flex font-extrabold mb-2 text-[var(--color-text-1)]">
              Usuário
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-3 mb-4 shadow-lg rounded-md focus:ring-2 focus:ring-white bg-[var(--color-input-1)]"
              required
            />
            <label className="flex font-extrabold mt-4 mb-2 text-[var(--color-text-1)]">
              Senha
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 mb-20 shadow-lg rounded-md focus:ring-2 focus:ring-white bg-[var(--color-input-1)]"
              required
            />
            <Button type="submit" isLoading={isLoading}>
              Entrar
            </Button>
            <Button onClick={loginWithGoogle} isLoading={isLoading} color="black" className="mt-10">
              Entre com o Google
            </Button>
          </form>
        </div>
      </div>
      {isOpen && (
        <Modal
          isOpen={isOpen}
          onClose={() => setIsOpen(false)}
          buttons={[
            {
              label: "OK",
              onClick: () => setIsOpen(false),
              className: "text-white bg-[var(--color-primary-1)]",
            },
          ]}
        >
          Ops!
          <br />
          Aconteceu um erro: {errorMessage}
        </Modal>
      )}
    </div>
  );
}
