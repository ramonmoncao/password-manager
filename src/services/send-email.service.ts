"use server";

import { createClient } from "../utils/supabase/client";
import nodemailer from "nodemailer";

export async function sendEmailById({
  id,
  subject,
  text,
}: {
  id: string;
  subject: string;
  text: string;
}) {
  const supabase = createClient()
  const {data, error} = await supabase
  .from("profiles")
  .select("*")
  .eq("id", id)
  .single();

  const to = data.email;
  console.log(to)

  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT),
    secure: false,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  await transporter.sendMail({
    from: process.env.SMTP_USER,
    to,
    subject,
    text,
  });

  return { success: true };
}


export async function sendAllEmailsByGroupId(projectId: number, where: string) {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("users_projects")
    .select("user_id")
    .eq("project_id", projectId);

  if (error) throw error;

  const userIds = data.map(u => u.user_id);

  for (const userId of userIds) {
    await sendEmailById({
      id: userId, 
      subject: "Alteração de Senha",
      text: "Senha Alterada no " + where
    });
  }
}
