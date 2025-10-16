"use client"

import { useEffect, useState } from "react";
// import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";

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
    <div className="flex h-screen flex-col md:flex-row">
      <div className="w-full flex items-center justify-center p-6">
        <div className="w-full max-w-md p-8 shadow-lg rounded-lg"style={{ color: "var(--foreground)" }}>
          <h2 className="text-2xl flex items-center justify-center font-bold mb-4"style={{ color: "var(--color-primary-1)" }}>Acesse sua conta</h2>
          {/* <p className="text-gray-500 mb-6">Insira as informações que você usou ao se registrar.</p> */}
          <form onSubmit={login}>
            <input
              type="email"
              placeholder="Usuário"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-3 mb-4 border rounded-md bg-white focus:ring-2 focus:ring-blue-500"
              required
            />
            {errorMessage && (
              <p className="text-red-500 text-sm mt-2">{errorMessage}</p>
            )}
            <input
              type="password"
              placeholder="Senha"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 mb-4 border rounded-md bg-white focus:ring-2 focus:ring-blue-500"
              required
            />
            <button
              type="submit"
              disabled={isLoading}

              className="w-full bg-gradient-to-r from-green-500 to-yellow-500 text-white p-3 rounded-md hover:opacity-90 transition-all disabled:opacity-50"
            >
              {isLoading ? "Entrando" : "Entrar"}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
