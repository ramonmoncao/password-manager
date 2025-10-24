"use client";

import Menu from "@/components/menu";
import ProjectList from "@/components/project-list";
import { useEffect, useState } from "react";
import { Eye, EyeOff, Copy } from "lucide-react";
import Button from "@/components/button";
import Notification from "@/components/notification";
import {
  getProjects,
  IProject,
  updatePassword,
} from "@/services/projects.service";
import Modal from "@/components/modal";
import { decrypt } from "@/utils/password-crypto";

interface Project {
  id: number;
  name: string;
  description: string;
  username: string;
  password: string;
}

interface NotificationItem {
  id: number;
  message: string;
  type: "success" | "error" | "info";
  duration: number;
}

export default function Projects() {
  const [search, setSearch] = useState<string>("");
  const [selectedProject, setSelectedProject] = useState<IProject | null>(null);
  const [showUsername, setShowUsername] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [projects, setProjects] = useState<IProject[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setLoading] = useState(true);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [projectToUpdate, setProjectToUpdate] = useState<IProject | null>(null);

  useEffect(() => {
    const getProjectsList = async () => {
      try {
        setLoading(true);
        const data = await getProjects();
        if ((data as any)?.error) {
          setError((data as any).error);
          return;
        }
        setProjects(data);
      } catch (err: any) {
        setError(err.message || String(err));
      } finally {
        setLoading(false);
      }
    };

    getProjectsList();
  }, []);

  const showNotification = (
    message: string,
    type: "success" | "error" | "info",
    duration = 4000
  ) => {
    const id = Date.now();
    setNotifications((prev) => [...prev, { id, message, type, duration }]);

    setTimeout(() => {
      setNotifications((prev) => prev.filter((n) => n.id !== id));
    }, duration);
  };

  const copyUsername = () => {
    if (selectedProject) {
      navigator.clipboard.writeText(selectedProject.user);
      showNotification("Usuário copiado!", "success");
    }
  };

  const copyPassword = () => {
    if (selectedProject) {
      navigator.clipboard.writeText(selectedProject.password);
      showNotification("Senha copiada!", "success");
    }
  };

  const handleUpdate = async (id: number) => {
    try {
      await updatePassword(id);
      showNotification("Senha atualizada com sucesso!", "success");

      const updatedProjects = await getProjects();
      setProjects(updatedProjects);

      const updatedProject = updatedProjects.find((p) => p.id === id);
      if (updatedProject) setSelectedProject(updatedProject);
    } catch (err) {
      console.error("Erro ao atualizar senha:", err);
      showNotification("Erro ao atualizar senha", "error");
    }
  };

  const getDate = (isoDate: string) => {
    const date = new Date(isoDate);
    return date.toLocaleString("pt-BR");
  };

  return (
    <div className="flex h-screen">
      <ProjectList
        isLoading={isLoading}
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

      <div className="flex-1 bg-[var(--color-box-2)] rounded-t-3xl shadow-md p-10 ml-6 mr-6 flex justify-center">
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
                    {showUsername ? selectedProject.user : "•".repeat(40)}
                  </span>
                  <button onClick={() => setShowUsername(!showUsername)}>
                    {showUsername ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                  <button onClick={copyUsername}>
                    <Copy size={20} />
                  </button>
                </div>
              </div>

              {/* Box de Senha */}
              <div className="flex flex-col">
                <label className="font-semibold mb-1 text-xl">Senha:</label>
                <div className="flex items-center bg-[var(--color-box-1)] rounded-md p-2 gap-2">
                  <span className="font-mono truncate w-full">
                    {showPassword ? selectedProject.password: "•".repeat(40)}
                  </span>
                  <button onClick={() => setShowPassword(!showPassword)}>
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                  <button onClick={copyPassword}>
                    <Copy size={20} />
                  </button>
                </div>
              </div>

              <Button
                onClick={() => {
                  setProjectToUpdate(selectedProject);
                  setIsConfirmOpen(true);
                }}
                className="mt-20"
              >
                Atualizar Senha
              </Button>
              <p className="text-center mt-2">
                senha atualizada em:{" "}
                {getDate(selectedProject.password_changed_at)}
              </p>
            </div>
            <Modal
              isOpen={isConfirmOpen}
              onClose={() => setIsConfirmOpen(false)}
              buttons={[
                {
                  label: "Confirmar",
                  onClick: async () => {
                    if (projectToUpdate) {
                      await handleUpdate(projectToUpdate.id);
                    }
                    setIsConfirmOpen(false);
                  },
                  className: "bg-transparent cursor-pointer",
                },
                {
                  label: "Cancelar",
                  onClick: () => setIsConfirmOpen(false),
                  className: "bg-red-500 text-white cursor-pointer"
                }
              ]}
            >
              <p className="text-center text-lg">
                Tem certeza que deseja atualizar a senha do projeto{" "}
                <b>{projectToUpdate?.name}</b>?
              </p>
            </Modal>
          </div>
        ) : (
          <div className="text-[var(--color-text-1)] text-lg flex items-center justify-center h-full">
            Selecione um projeto à esquerda para ver os detalhes.
          </div>
        )}
      </div>

      {/* Notificações empilháveis */}
      <div className="fixed bottom-4 right-4 flex flex-col gap-2 z-50">
        {notifications.map((n) => (
          <Notification
            key={n.id}
            message={n.message}
            type={n.type}
            duration={n.duration}
          />
        ))}
      </div>
    </div>
  );
}
