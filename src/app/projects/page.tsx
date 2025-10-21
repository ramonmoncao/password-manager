"use client";

import Menu from "@/components/menu";
import ProjectList from "@/components/project-list";
import { useState } from "react";
import { Eye, EyeOff, Copy } from "lucide-react";

interface Project {
  id: number;
  name: string;
  description: string;
  username: string;
  password: string;
}

export default function Projects() {
  const [search, setSearch] = useState<string>("");
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [showUsername, setShowUsername] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const projects: Project[] = [
    { id: 1, name: "Projeto 1", description: "Informações do Projeto 1", username: "user1", password: "senha123" },
    { id: 2, name: "Projeto 2", description: "Informações do Projeto 2", username: "user2", password: "senha456" },
    { id: 3, name: "Projeto 3", description: "Informações do Projeto 3", username: "user3", password: "senha789" },
  ];

  const copyUsername = () => {
    if (selectedProject) {
      navigator.clipboard.writeText(selectedProject.username);
      alert("Usuário copiado!");
    }
  };

  const copyPassword = () => {
    if (selectedProject) {
      navigator.clipboard.writeText(selectedProject.password);
      alert("Senha copiada!");
    }
  };

  return (
      <div className=" flex h-screen">
        <ProjectList
          projects={projects}
          search={search}
          setSearch={setSearch}
          selectedProject={selectedProject}
          setSelectedProject={(project) => {
            setSelectedProject(project);
            setShowUsername(false);
            setShowPassword(false);
          }}
        />

        <div className="flex-1 bg-[var(--color-box-2)] rounded-t-3xl p-10 ml-10 mr-10 flex justify-center">
          {selectedProject ? (
            <div className="w-full max-w-xl">
              <h2 className="text-3xl font-semibold text-[var(--color-primary-1)] mb-6 text-center">
                {selectedProject.name}
              </h2>
              <div className="p-6 rounded-lg w-full text-[var(--color-text-1)] space-y-6">
                {/* Box de Usuário */}
                <div className="flex flex-col">
                  <label className="font-bold mb-1 text-xl">Usuário:</label>
                  <div className="flex items-center bg-[var(--color-box-1)] rounded-md p-2 gap-2">
                    <span className="font-mono truncate w-full">
                      {showUsername ? selectedProject.username : "•".repeat(40)}
                    </span>
                    <button onClick={() => setShowUsername(!showUsername)}>
                      {showUsername ? <EyeOff size={20} /> : <Eye size={20} className="cursor-pointer"/>}
                    </button>
                    <button onClick={copyUsername} className="cursor-pointer">
                      <Copy size={20} />
                    </button>
                  </div>
                </div>

                {/* Box de Senha */}
                <div className="flex flex-col">
                  <label className="font-semibold mb-1 text-xl">Senha:</label>
                  <div className="flex items-center bg-[var(--color-box-1)] rounded-md p-2 gap-2">
                    <span className="font-mono truncate w-full">
                      {showPassword ? selectedProject.password : "•".repeat(40)}
                    </span>
                    <button onClick={() => setShowPassword(!showPassword)}>
                      {showPassword ? <EyeOff size={20} /> : <Eye size={20} className="cursor-pointer"/>}
                    </button>
                    <button onClick={copyPassword} className="cursor-pointer">
                      <Copy size={20} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-[var(--color-text-1)] text-lg flex items-center justify-center h-full">
              Selecione um projeto à esquerda para ver os detalhes.
            </div>
          )}
        </div>
      </div>
  );
}
