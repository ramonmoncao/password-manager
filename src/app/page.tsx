"use client"

import { useEffect, useState } from "react";
// import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";
import Header from "@/components/header";

export default function Login() {

  // const supabase = createClient()
  const router = useRouter()
  const [checkingSession, setCheckingSession] = useState(true)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState("")

  useEffect(() => {
    const checkSession = async () => {
      // const { data: { session } } = await supabase.auth.getSession()
      // if (session?.user) {
      //   router.replace("/condominios")
      // } else {
      //   setCheckingSession(false)
      // }
    }
    checkSession()
  }, [])

  const login = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setErrorMessage("")

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
  }

  // Sem essa verificação, ao acessar a raiz LOGADO, ele
  // por um segundo ainda aparece a tela de login antes de redirecionar para dashboard

  // if (checkingSession) {
  //   return null
  // }

  return (
    <div className="flex flex-col h-screen">
      <div style={{ backgroundColor: "var(--background)" }}>
        <Header />
      </div>
      <div className="flex h-screen flex-col md:flex-row md:items-stretch md:justify-end">
        <div className="w-full md:w-auto flex items-start p-6 md:justify-end h-full"
          style={{ backgroundColor: "var(--background)" }}>
          <div className="w-full max-w-md p-8" >
            <h2 className="text-2xl font-extrabold text-center mb-30"
              style={{ color: "var(--color-primary-1)" }}>Acesse sua conta</h2>
            {/* <p className="text-gray-500 mb-6">Insira as informações que você usou ao se registrar.</p> */}
            <form onSubmit={login}>
              <h2 className="flex font-extrabold"
                style={{ color: "var(--color-text-1)" }}>Usuário</h2>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-3 mb-15 shadow-lg rounded-md focus:ring-2 focus:ring-blue-500"
                style={{ backgroundColor: "var(--color-box-1)" }}
                required
              />
              {errorMessage && (
                <p className="text-red-500 text-sm mt-2">{errorMessage}</p>
              )}
              <h2 className="flex font-extrabold"
                style={{ color: "var(--color-text-1)" }}>Senha</h2>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-3 mb-20 shadow-lg rounded-md focus:ring-2 focus:ring-blue-500"
                style={{ backgroundColor: "var(--color-box-1)" }}
                required
              />
              <button
                type="submit"
                disabled={isLoading}
                className="w-full text-white p-3 rounded-md font-extrabold hover:opacity-90 transition-all disabled:opacity-50"
                style={{ backgroundColor: "var(--color-primary-2)" }}
              >
                {isLoading ? "Entrando" : "Entrar"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
