"use server"
import { IProject } from './projects.service';

import { decrypt, encrypt } from "@/utils/password-crypto";
import { generateSecurePassword } from "@/utils/password-generator";
import { createClient } from "@/utils/supabase/server";
import { addDays } from 'date-fns';

export interface IProjectGroup{
  id: number;
  name: string;
  projects: IProject[];
}

export const getProjectGroups = async () => {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("project_group")
    .select("*")
    .order("id");

  if (error) throw new Error(error.message);

  
  return data ?? [];
};

export const updateAllPasswords = async (group_id: number) => {
  const supabase = await createClient();

  const key = process.env.ENCRYPTION_KEY!;
  const iv = process.env.ENCRYPTION_IV!;

  const { data: projects, error: fetchError } = await supabase
    .from("projects")
    .select("*")
    .eq("group_id", group_id);

  if (fetchError) throw new Error(fetchError.message);
  if (!projects?.length) return [];

  const updates = projects.map(async (project) => {
    const newPassword = generateSecurePassword();
    const encrypted = encrypt(newPassword, key, iv);

    const { data, error } = await supabase
      .from("projects")
      .update({
        password: encrypted,
        password_changed_at: new Date().toISOString(),
        next_change: addDays(new Date(), 50).toISOString(),
      })
      .eq("id", project.id)
      .select()
      .single();

    if (error) throw new Error(error.message);
    return data;
  });


  const results = await Promise.all(updates);

  return results;
};
