"use server";

import { decrypt, encrypt } from "../utils/password-crypto";
import { generateSecurePassword } from "../utils/password-generator";
import { createClient } from "../utils/supabase/server";
import { addDays } from "date-fns";
import { sendAllEmailsByGroupId } from "./send-email.service";

export interface IProject {
  id: number;
  name: string;
  user: string;
  password: string;
  password_changed_at: string;
}

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
      next_change: addDays(new Date(), 50).toISOString(),
    })
    .eq("id", id)
    .select()
    .single();
    const where = "Projeto: " + data.name
    sendAllEmailsByGroupId(data.group_id, where)
  if (error) throw new Error(error.message);
  return data ?? [];
};

export const getProjectByGroup = async (id: number) => {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("projects")
    .select("*")
    .eq("group_id", id)
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

export const getTodayProjects = async () => {
  const supabase = await createClient();
  const today = new Date();
  const start = new Date(today);
  start.setHours(0, 0, 0, 0);
  const end = new Date(today);
  end.setHours(23, 59, 59, 999);

  const { data, error } = await supabase
    .from("projects")
    .select("*")
    .gte("next_change", start.toISOString())
    .lte("next_change", end.toISOString())
    .order("id");

  if (error) throw new Error(error.message);
  return data;
};