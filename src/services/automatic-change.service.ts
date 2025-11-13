"user service"
import { createClient } from "@/utils/supabase/client";
import cron from "node-cron";
import { updatePassword } from "./projects.service";

export const getTodayProject = async () => {
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

  if (error) console.error(error);
  return data;
};
export const startAutoPasswordUpdate = () => {
  console.log("🔄 Agendador de atualização automática iniciado...");
  cron.schedule("0 0 * * *", async () => {
    console.log("🕛 Rodando atualização diária de senhas...");

    try {
      const projects = await getTodayProject();

      if (!projects || projects.length === 0) {
        console.log("✅ Nenhum projeto para atualizar hoje.");
        return;
      }

      console.log(`🔍 Encontrados ${projects.length} projetos para atualizar.`);

      for (const project of projects) {
        try {
          await updatePassword(project.id);
          console.log(`✅ Senha atualizada para o projeto: ${project.name}`);
        } catch (err) {
          console.error(`❌ Erro ao atualizar senha do projeto ${project.name}:`, err);
        }
      }

      console.log("🎯 Atualização diária concluída com sucesso!");
    } catch (err) {
      console.error("💥 Erro geral na atualização automática:", err);
    }
  });
};