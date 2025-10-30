"use client";

import Menu from "@/components/menu";
import ProjectList from "@/components/project-list";
import { useEffect, useState } from "react";
import { Eye, EyeOff, Copy } from "lucide-react";
import Button from "@/components/button";
import Notification from "@/components/notification";
import Modal from "@/components/modal";
import {
  getProjectByGroup,
  updatePassword,
  IProject,
} from "@/services/projects.service";
import {
  getProjectGroups,
  IProjectGroup,
  updateAllPasswords,
} from "@/services/project-group.service";

interface NotificationItem {
  id: number;
  message: string;
  type: "success" | "error" | "info";
  duration: number;
}

export default function Projects() {
  const [search, setSearch] = useState<string>("");
  const [selectedProjectGroup, setSelectedProjectGroup] = useState<IProjectGroup | null>(null);
  const [projectsInGroup, setProjectsInGroup] = useState<IProject[]>([]);
  const [selectedProject, setSelectedProject] = useState<IProject | null>(null);
  const [showUsername, setShowUsername] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [projectGroup, setProjectGroup] = useState<IProjectGroup[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setLoading] = useState(true);
  const [isLoadingInBox, setLoadingInBox] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [projectToUpdate, setProjectToUpdate] = useState<IProject | null>(null);
  const [projectGroupToUpdate, setProjectGroupToUpdate] = useState<IProjectGroup | null>(null);

  useEffect(() => {
    const getProjectsList = async () => {
      try {
        setLoading(true);
        const data = await getProjectGroups();
        if ((data as any)?.error) {
          setError((data as any).error);
          return;
        }
        setProjectGroup(data);
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

  const getProjects = async (groupId: number) => {
    try {
      setLoadingInBox(true);
      const data = await getProjectByGroup(groupId);
      if ((data as any)?.error) {
        setError((data as any).error);
        return;
      }
      setProjectsInGroup(data);
      setSelectedProject(null); // limpa seleção anterior
    } catch (err: any) {
      setError(err.message || String(err));
    } finally {
      setLoadingInBox(false);
    }
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

      const updatedProjects = await getProjectByGroup(selectedProjectGroup!.id);
      setProjectsInGroup(updatedProjects);

      const updatedProject = updatedProjects.find((p) => p.id === id);
      if (updatedProject) setSelectedProject(updatedProject);
    } catch (err) {
      console.error("Erro ao atualizar senha:", err);
      showNotification("Erro ao atualizar senha", "error");
    }
  };

  const handleAllUpdate = async (id: number) => {
    try {
      await updateAllPasswords(id);
      showNotification("Senhas atualizadas com sucesso!", "success");

      const updatedProjects = await getProjectByGroup(id);
      setProjectsInGroup(updatedProjects);
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
    <div className="flex w-full">
      <ProjectList
        isLoading={isLoading}
        projects={projectGroup}
        search={search}
        setSearch={setSearch}
        selectedProject={selectedProjectGroup}
        setSelectedProject={(project) => {
          setSelectedProjectGroup(project);
          setShowUsername(false);
          setShowPassword(false);
          if (project) getProjects(project.id);
        }}
      />

      <div className="flex-shrink-0 bg-[var(--color-box-2)] rounded-t-3xl min-h-screen shadow-md p-10 ml-6 mr-6 flex flex-col justify-start w-4xl">
        {isLoadingInBox ? (
          <div className="flex flex-col items-center justify-center h-full py-10 text-[var(--color-text-1)]">
            <div className="w-6 h-6 border-4 border-[var(--color-primary-2)] border-t-transparent rounded-full animate-spin mb-3" />
            <p className="text-sm">Carregando projetos...</p>
          </div>
        ) : projectsInGroup.length > 0 ? (
          <div className="w-full">
            <h2 className="text-3xl font-semibold text-[var(--color-primary-1)] mb-6 text-center">
              {selectedProjectGroup?.name}
            </h2>

            <div className="p-6 rounded-lg w-full text-[var(--color-text-1)] space-y-6">
              {projectsInGroup.map((project) => {
                const isSelected = selectedProject?.id === project.id;
                return (
                  <div
                    key={project.id}
                    className="p-4 rounded-md mb-4 transition-all duration-300 bg-[var(--color-box-1)]"
                  >
                    <div className="flex justify-between items-center">
                      <h3 className="font-semibold text-xl w-md">{project.name}</h3>
                      <Button 
                      className="w-md"
                        onClick={() => {
                          if (isSelected) {
                            setSelectedProject(null);
                          } else {
                            setSelectedProject(project);
                            setShowUsername(false);
                            setShowPassword(false);
                          }
                        }}
                      >
                        {isSelected ? "Fechar" : "Ver Detalhes"}
                      </Button>
                    </div>

                    {isSelected && (
                      <div className="mt-4 space-y-4 border-t border-[var(--color-text-1)] pt-4">
                        <div className="flex flex-col">
                          <label className="font-bold mb-1 text-lg">Usuário:</label>
                          <div className="flex items-center bg-[var(--color-box-2)] rounded-md p-2 gap-2">
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

                        <div className="flex flex-col">
                          <label className="font-semibold mb-1 text-lg">Senha:</label>
                          <div className="flex items-center bg-[var(--color-box-2)] rounded-md p-2 gap-2">
                            <span className="font-mono truncate w-full">
                              {showPassword ? selectedProject.password : "•".repeat(40)}
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
                          className="mt-4"
                        >
                          Atualizar Senha
                        </Button>

                        <p className="text-center mt-2 text-sm opacity-80">
                          Senha atualizada em: {getDate(selectedProject.password_changed_at)}
                        </p>
                      </div>
                    )}
                  </div>
                );
              })}

              <Button
                onClick={() => {
                  setProjectGroupToUpdate(selectedProjectGroup);
                  setIsConfirmOpen(true);
                }}
                className="mt-6"
              >
                Atualizar Todas as Senhas
              </Button>
            </div>
          </div>
        ) : (
          <div className="text-[var(--color-text-1)] text-lg flex items-center justify-center h-full">
            Selecione um grupo à esquerda para ver os projetos.
          </div>
        )}

        <Modal
          isOpen={isConfirmOpen}
          onClose={() => setIsConfirmOpen(false)}
          buttons={[
            {
              label: "Confirmar",
              onClick: async () => {
                if (projectToUpdate) {
                  await handleUpdate(projectToUpdate.id);
                  setProjectToUpdate(null);
                }
                if (projectGroupToUpdate) {
                  await handleAllUpdate(projectGroupToUpdate.id);
                  setProjectGroupToUpdate(null);
                }
                setIsConfirmOpen(false);
              },
              className: "bg-transparent cursor-pointer",
            },
            {
              label: "Cancelar",
              onClick: () => setIsConfirmOpen(false),
              className: "bg-red-500 text-white cursor-pointer",
            },
          ]}
        >
          <p className="text-center text-lg">
            Tem certeza que deseja atualizar a senha de:{" "}
            <b>{projectGroupToUpdate?.name}{projectToUpdate?.name}</b>?
          </p>
        </Modal>
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
