import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";


export async function middleware(req: NextRequest) {
  console.log("🔥 Middleware executado em:", req.nextUrl.pathname);

  let res = NextResponse.next();

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll: () => {
          console.log("📍 Cookies lidos:", req.cookies.getAll());
          return req.cookies.getAll();
        },
        setAll: (cookiesToSet) => {
          console.log("📍 Cookies a serem setados:", cookiesToSet);
          
          cookiesToSet.forEach(({ name, value }) => req.cookies.set(name, value));
          
          res = NextResponse.next();
          cookiesToSet.forEach(({ name, value, options }) =>
            res.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  console.log("🔎 Checando usuário autenticado...");
  const { data: { user } } = await supabase.auth.getUser();

  console.log("🔵 Usuário no middleware:", user);
  console.log("🔵 Path acessado:", req.nextUrl.pathname);

  if (!user) {
    console.log("🚫 Usuário não autenticado, redirecionando...");
    const url = new URL("/", req.url);
    url.searchParams.set("from", req.nextUrl.pathname);
    return NextResponse.redirect(url);
  }

  console.log("✅ Usuário autenticado, acesso liberado!");
  return res;
}

export const config = {
  matcher: [
    "/projects/:path*",
    "/request/:path*"
  ],
};

