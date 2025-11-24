"use server";
import { IProject } from "./projects.service";

import { decrypt, encrypt } from "@/utils/password-crypto";
import { generateSecurePassword } from "@/utils/password-generator";
import { createClient } from "@/utils/supabase/server";
import { addDays } from "date-fns";
import { da } from "date-fns/locale";
import { sendAllEmailsByGroupId } from "./send-email.service";

export interface IProjectGroup {
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

export async function getUserProjectGroups(
  userId: string
): Promise<IProjectGroup[]> {
  const supabase = await createClient();

  const {
  data: { user },
} = await supabase.auth.getUser();
  console.log("DATA: ", user);

  const { data: userGroups, error } = await supabase
    .from("users_projects")
    .select("project_id")
    .eq("user_id", userId)
    .eq("active", true);

  if (error) throw new Error(error.message);

  if (!userGroups || userGroups.length === 0) return [];

  const groupIds = userGroups.map((g) => g.project_id);

  const { data: groups } = await supabase
    .from("project_group")
    .select("id, name")
    .in("id", groupIds);

  if (!groups) return [];

  const result: IProjectGroup[] = [];

  for (const group of groups) {
    const { data: projects } = await supabase
      .from("projects")
      .select("*")
      .eq("group_id", group.id);

    result.push({
      id: group.id,
      name: group.name,
      projects: projects || [],
    });
  }

  return result;
}

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
  const where = "Grupo " + group_id
  sendAllEmailsByGroupId(group_id, where)
  const results = await Promise.all(updates);

  return results;
};
