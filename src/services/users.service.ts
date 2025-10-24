import { createClient } from "@/utils/supabase/client";

export interface IUser {
  id: string;
  name: string;
  email: string;
  role: string;
}

export const getUsers = async () => {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .order("id");

  if (error) throw new Error(error.message);
  return data ?? [];
};

export async function getOrCreateUserProfile(user: any) {
  const supabase = createClient();

  const { data: existing, error: selectError } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .maybeSingle();

  if (selectError) throw selectError;
  if (existing) return existing;

  const name =
    user.user_metadata?.full_name ||
    user.user_metadata?.name ||
    user.email?.split("@")[0] ||
    "Usuário";

  const { data, error } = await supabase
    .from("profiles")
    .insert([
      {
        id: user.id,
        name,
        role: "USER",
      },
    ])
    .select()
    .single();

  if (error) throw error;
  return data;
}