
import cron from "node-cron";

interface IProject {
  id: number;
  name: string;
  user: string;
  password: string;
  password_changed_at: string;
}
export interface ApiResponse {
  sucess: boolean; 
  count: number;
  data: IProject[];
}

export const startAutoPasswordUpdate = () => {
  console.log("🔄 Agendador de atualização automática iniciado...");
  cron.schedule("*/10 * * * * *", async () => {
    console.log("🕛 Rodando atualização diária de senhas...");

    try {
      const projects = await fetchProjects();

      if (!projects.data || projects.data.length === 0) {
        console.log("✅ Nenhum projeto para atualizar hoje.");
        return;
      }

      console.log(`🔍 Encontrados ${projects.data.length} projetos para atualizar.`);

      for (const project of projects.data) {
        try {
          await updateProjectPassword(project.id);
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

async function fetchProjects(): Promise<ApiResponse> {
  const response = await fetch("http://localhost:3000/api/projects/today");
  if (!response.ok) {
    throw new Error("Erro ao buscar Projetos");
  }
  const data: ApiResponse = await response.json();
  return data;
}

async function updateProjectPassword(id:number) {
  const response = await fetch(`http://localhost:3000/api/projects/${id}`,  {method: "PATCH"});
  if (!response.ok) {
    throw new Error("Erro ao atualizar senha do Projeto");
  }
  const data: ApiResponse = await response.json();
  return data;
}