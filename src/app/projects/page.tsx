"use client";

import { useEffect, useState, useCallback } from "react";
import { Eye, EyeOff, Copy } from "lucide-react";

import Menu from "@/components/menu";
import ProjectList from "@/components/project-list";
import Button from "@/components/button";
import Notification from "@/components/notification";
import Modal from "@/components/modal";

import {
  getProjectByGroup,
  updatePassword,
  IProject,
} from "@/services/projects.service";
import {
  getUserProjectGroups,
  IProjectGroup,
  updateAllPasswords,
} from "@/services/project-group.service";
import { createClient } from "@/utils/supabase/client";

interface NotificationItem {
  id: number;
  message: string;
  type: "success" | "error" | "info";
  duration: number;
}

export default function Projects() {
  const supabase = createClient();

  const [user, setUser] = useState<any>(null);
  const [userProfile, setUserProfile] = useState<any>(null);
  const [search, setSearch] = useState("");
  const [selectedGroup, setSelectedGroup] = useState<IProjectGroup | null>(null);
  const [projects, setProjects] = useState<IProject[]>([]);
  const [selectedProject, setSelectedProject] = useState<IProject | null>(null);
  const [showUsername, setShowUsername] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [groups, setGroups] = useState<IProjectGroup[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setLoading] = useState(true);
  const [isBoxLoading, setBoxLoading] = useState(false);
  const [isConfirmOpen, setConfirmOpen] = useState(false);
  const [projectToUpdate, setProjectToUpdate] = useState<IProject | null>(null);
  const [groupToUpdate, setGroupToUpdate] = useState<IProjectGroup | null>(null);

  // 🔹 Recupera usuário do Supabase
  useEffect(() => {
    const fetchUserAndRole = async () => {
      const { data } = await supabase.auth.getUser();
      const currentUser = data?.user;
      setUser(currentUser);

      if (currentUser) {
        const { data: profile, error } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", currentUser.id)
          .single();

        if (!error && profile) setUserProfile(profile);
      }
    };
    fetchUserAndRole();
  }, [supabase]);

  // 🔹 Busca grupos de projetos do usuário
  useEffect(() => {
    if (!user) return;

    const fetchGroups = async () => {
      try {
        setLoading(true);
        const data = await getUserProjectGroups(user.id);
        if ((data as any)?.error) throw new Error((data as any).error);
        setGroups(data);
      } catch (err: any) {
        setError(err.message || String(err));
      } finally {
        setLoading(false);
      }
    };

    fetchGroups();
  }, [user]);

  // 🔹 Exibir notificações
  const showNotification = useCallback(
    (message: string, type: "success" | "error" | "info", duration = 4000) => {
      const id = Date.now();
      setNotifications((prev) => [...prev, { id, message, type, duration }]);
      setTimeout(() => {
        setNotifications((prev) => prev.filter((n) => n.id !== id));
      }, duration);
    },
    []
  );

  // 🔹 Buscar projetos do grupo
  const getProjects = useCallback(async (groupId: number) => {
    try {
      setBoxLoading(true);
      const data = await getProjectByGroup(groupId);
      if ((data as any)?.error) throw new Error((data as any).error);
      setProjects(data);
      setSelectedProject(null);
    } catch (err: any) {
      setError(err.message || String(err));
    } finally {
      setBoxLoading(false);
    }
  }, []);

  // 🔹 Copiar texto (usuário/senha)
  const handleCopy = useCallback(
    (text: string, label: string) => {
      navigator.clipboard.writeText(text);
      showNotification(`${label} copiado!`, "success");
    },
    [showNotification]
  );

  // 🔹 Atualizar senha de 1 projeto
  const handleUpdate = useCallback(
    async (id: number) => {
      try {
        await updatePassword(id);
        showNotification("Senha atualizada com sucesso!", "success");
        const updated = await getProjectByGroup(selectedGroup!.id);
        setProjects(updated);
        setSelectedProject(updated.find((p) => p.id === id) || null);
      } catch {
        showNotification("Erro ao atualizar senha", "error");
      }
    },
    [selectedGroup, showNotification]
  );

  // 🔹 Atualizar senhas de todos os projetos do grupo
  const handleAllUpdate = useCallback(
    async (id: number) => {
      try {
        await updateAllPasswords(id);
        showNotification("Senhas atualizadas com sucesso!", "success");
        const updated = await getProjectByGroup(id);
        setProjects(updated);
      } catch {
        showNotification("Erro ao atualizar senha", "error");
      }
    },
    [showNotification]
  );

  const getDate = (iso: string) => new Date(iso).toLocaleString("pt-BR");

  return (
    <div className="flex w-full">
      <ProjectList
        isLoading={isLoading}
        projects={groups}
        search={search}
        setSearch={setSearch}
        selectedProject={selectedGroup}
        setSelectedProject={(group) => {
          setSelectedGroup(group);
          setShowUsername(false);
          setShowPassword(false);
          if (group) getProjects(group.id);
        }}
      />

      <div className="flex-shrink-0 bg-[var(--color-box-2)] rounded-t-3xl min-h-screen shadow-md p-10 mx-6 flex flex-col justify-start w-4xl">
        {isBoxLoading ? (
          <div className="flex flex-col items-center justify-center h-full py-10 text-[var(--color-text-1)]">
            <div className="w-6 h-6 border-4 border-[var(--color-primary-2)] border-t-transparent rounded-full animate-spin mb-3" />
            <p className="text-sm">Carregando projetos...</p>
          </div>
        ) : projects.length > 0 ? (
          <div className="w-full">
            <h2 className="text-3xl font-semibold text-[var(--color-primary-1)] mb-6 text-center">
              {selectedGroup?.name}
            </h2>

            <div className="p-6 rounded-lg w-full text-[var(--color-text-1)] space-y-6">
              {projects.map((project) => {
                const isSelected = selectedProject?.id === project.id;
                const renderField = (
                  label: string,
                  value: string,
                  show: boolean,
                  setShow: (v: boolean) => void,
                  copyLabel: string
                ) => (
                  <div className="flex flex-col">
                    <label className="font-semibold mb-1 text-lg">{label}</label>
                    <div className="flex items-center bg-[var(--color-box-2)] rounded-md p-2 gap-2">
                      <span className="font-mono truncate w-full">
                        {show ? value : "•".repeat(40)}
                      </span>
                      <button onClick={() => setShow(!show)}>
                        {show ? <EyeOff size={20} /> : <Eye size={20} />}
                      </button>
                      <button onClick={() => handleCopy(value, copyLabel)}>
                        <Copy size={20} />
                      </button>
                    </div>
                  </div>
                );

                return (
                  <div
                    key={project.id}
                    className="p-4 rounded-md mb-4 transition-all duration-300 bg-[var(--color-box-1)]"
                  >
                    <div className="flex justify-between items-center">
                      <h3 className="font-semibold text-xl w-md">{project.name}</h3>
                      <Button
                        className="w-md"
                        onClick={() =>
                          setSelectedProject(isSelected ? null : project)
                        }
                      >
                        {isSelected ? "Fechar" : "Ver Detalhes"}
                      </Button>
                    </div>

                    {isSelected && (
                      <div className="mt-4 space-y-4 border-t border-[var(--color-text-1)] pt-4">
                        {renderField("Usuário:", project.user, showUsername, setShowUsername, "Usuário")}
                        {renderField("Senha:", project.password, showPassword, setShowPassword, "Senha")}

                        {/* 🔹 Botão visível apenas se user.role !== "USER" */}
                        {userProfile?.role !== "USER" && (
                          <Button
                            onClick={() => {
                              setProjectToUpdate(selectedProject);
                              setConfirmOpen(true);
                            }}
                            className="mt-4"
                          >
                            Atualizar Senha
                          </Button>
                        )}

                        <p className="text-center mt-2 text-sm opacity-80">
                          Senha atualizada em: {getDate(selectedProject.password_changed_at)}
                        </p>
                      </div>
                    )}
                  </div>
                );
              })}

              {/* 🔹 Botão "Atualizar Todas" visível apenas se user.role !== "USER" */}
              {userProfile?.role !== "USER" && (
                <Button
                  onClick={() => {
                    setGroupToUpdate(selectedGroup);
                    setConfirmOpen(true);
                  }}
                  className="mt-6"
                >
                  Atualizar Todas as Senhas
                </Button>
              )}
            </div>
          </div>
        ) : (
          <div className="text-[var(--color-text-1)] text-lg flex items-center justify-center h-full">
            Selecione um grupo à esquerda para ver os projetos.
          </div>
        )}

        {/* 🔹 Modal de confirmação */}
        <Modal
          isOpen={isConfirmOpen}
          onClose={() => setConfirmOpen(false)}
          buttons={[
            {
              label: "Confirmar",
              onClick: async () => {
                if (projectToUpdate) {
                  await handleUpdate(projectToUpdate.id);
                  setProjectToUpdate(null);
                }
                if (groupToUpdate) {
                  await handleAllUpdate(groupToUpdate.id);
                  setGroupToUpdate(null);
                }
                setConfirmOpen(false);
              },
              className: "bg-transparent cursor-pointer",
            },
            {
              label: "Cancelar",
              onClick: () => setConfirmOpen(false),
              className: "bg-red-500 text-white cursor-pointer",
            },
          ]}
        >
          <p className="text-center text-lg">
            Tem certeza que deseja atualizar a senha de:{" "}
            <b>{groupToUpdate?.name || projectToUpdate?.name}</b>?
          </p>
        </Modal>
      </div>

      {/* 🔹 Notificações */}
      <div className="fixed bottom-4 right-4 flex flex-col gap-2 z-50">
        {notifications.map((n) => (
          <Notification key={n.id} {...n} />
        ))}
      </div>
    </div>
  );
}
