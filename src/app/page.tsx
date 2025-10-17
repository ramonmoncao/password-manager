"use client";

import { useEffect, useState } from "react";
// import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";
import Header from "@/components/header";
import Image from "next/image";
import Button from "@/components/button";

export default function Login() {
  // const supabase = createClient()
  const router = useRouter();
  const [checkingSession, setCheckingSession] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const checkSession = async () => {
      // const { data: { session } } = await supabase.auth.getSession()
      // if (session?.user) {
      //   router.replace("/condominios")
      // } else {
      //   setCheckingSession(false)
      // }
    };
    checkSession();
  }, []);

  const login = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage("");

    // try {
    //   const { data, error } = await supabase.auth.signInWithPassword({ email, password })
    //   // throw new Error()
    //   if (error || !data.user) {
    //     setErrorMessage("E-mail ou senha inválidos")
    //     setIsLoading(false)
    //     return
    //   }

    //   router.replace("/condominios")
    // } catch (err) {
    //   setErrorMessage("Erro inesperado. Tente novamente.")
    //   setIsLoading(false)
    // }
  };

  // Sem essa verificação, ao acessar a raiz LOGADO, ele
  // por um segundo ainda aparece a tela de login antes de redirecionar para dashboard

  // if (checkingSession) {
  //   return null
  // }

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
            {errorMessage && (
              <p className="text-red-500 text-sm mt-2">{errorMessage}</p>
            )}

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
          </form>
        </div>
      </div>
    </div>
  );
}
