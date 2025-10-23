"use server";

import { decrypt, encrypt } from "@/utils/password-crypto";
import { generateSecurePassword } from "@/utils/password-generator";
import { createClient } from "@/utils/supabase/server";

export const getProjects = async () => {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("projects")
    .select("*")
    .order("id");

  if (error) throw new Error(error.message);

  const key = process.env.ENCRYPTION_KEY!;
  const iv = process.env.ENCRYPTION_IV!;

  const decryptedData = data.map((project) => ({
    ...project,
    password: project.password ? decrypt(project.password, key, iv) : null,
  }));

  return decryptedData ?? [];
};

export const updatePassword = async (id: number) => {
  const supabase = await createClient();

  const key = process.env.ENCRYPTION_KEY!;
  const iv = process.env.ENCRYPTION_IV!;
  const newPassword = generateSecurePassword();

  const { data, error } = await supabase
    .from("projects")
    .update({
      password: encrypt(newPassword, key, iv),
      password_changed_at: new Date().toISOString(),
    })
    .eq("id", id)
    .select()
    .single();

  if (error) throw new Error(error.message);
  return data ?? [];
};
