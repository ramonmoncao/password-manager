import { generateSecurePassword } from "@/utils/password-generator";
import { createClient } from "@/utils/supabase/client";

export interface IProject {
  id: number;
  name: string;
  user: string;
  password: string;
  id_admin: string;
  password_changed_at: string;
}

export const getProjects = async () => {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("projects")
    .select("*")
    .order("id");

  if (error) throw new Error(error.message);
  return data ?? [];
};

export const updatePassword = async (id: number) => {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("projects")
    .update({ 
      password: generateSecurePassword(),
      password_changed_at: new Date().toISOString()
    })
    .eq("id", id)
    .select()
    .single();
  if (error) throw new Error(error.message);
  return data ?? [];
};
