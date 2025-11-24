"use client";

import { useState, useRef, useEffect } from "react";
import Button from "@/components/button";
import { ChevronDown } from "lucide-react";
import { getProjects, IProject } from "@/services/projects.service";
import { createAccessRequest } from "@/services/access-request.service";
import { createClient } from "@/utils/supabase/client";
import Notification, { NotificationProps } from "@/components/notification";
import { getProjectGroups } from "@/services/project-group.service";



export default function AccessRequest() {
  const supabase = createClient();

  const [user, setUser] = useState<any>(null);
  const [isTemporary, setIsTemporary] = useState(false);
  const [selectedProject, setSelectedProject] = useState("");
  const [search, setSearch] = useState("");
  const [reason, setReason] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [projects, setProjects] = useState<IProject[]>([]);
  const [isLoading, setLoading] = useState(false);
  const [notifications, setNotifications] = useState<NotificationProps[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const getUser = async () => {
      const { data } = await supabase.auth.getUser();
      setUser(data.user);
    };
    getUser();
  }, []);

  useEffect(() => {
    const getProjectsList = async () => {
      try {
        setLoading(true);
        const data = await getProjectGroups();
        setProjects(data);
      } catch (err: any) {
        showNotification(err.message || String(err), "error");
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

  const filteredProjects = projects.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  useEffect(() => {
    if (isDropdownOpen && inputRef.current) inputRef.current.focus();
  }, [isDropdownOpen]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) {
      showNotification("Usuário não logado!", "error");
      return;
    }

    if (!selectedProject) {
      showNotification("Selecione um projeto!", "error");
      return;
    }

    try {
      const [projectId] = selectedProject.split(" - ");
      await createAccessRequest({
        id_user: user.id,
        id_project: Number(projectId),
        reason,
        temporary: isTemporary,
      });

      showNotification("Solicitação criada com sucesso!", "success");
      setSelectedProject("");
      setReason("");
      setIsTemporary(false);
    } catch (err: any) {
      showNotification(err.message || "Erro ao criar solicitação", "error");
    }
  };

  return (
    <div className="flex-1 bg-[var(--color-box-3)] shadow-md h-full rounded-tr-3xl p-10 mr-6 flex justify-center items-start">
      <div className="w-full max-w-5xl flex justify-center gap-10">
        <form
          className="flex flex-col gap-6 text-lg text-[var(--color-text-1)] w-lg"
          onSubmit={handleSubmit}
        >
          <h2 className="text-3xl font-semibold text-[var(--color-primary-1)] mb-6 text-center">
            Solicitar acesso
          </h2>

          <div className="relative" ref={dropdownRef}>
            <label className="block mb-2">Selecione um projeto:</label>
            <div
              className="flex items-center border border-gray-400 rounded-md bg-[var(--color-box-1)] p-2 cursor-pointer"
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            >
              <input
                type="text"
                ref={inputRef}
                readOnly={!isDropdownOpen}
                value={isDropdownOpen ? search : selectedProject}
                placeholder="Nome do projeto..."
                onChange={(e) => setSearch(e.target.value)}
                className="flex-1 bg-transparent outline-none cursor-pointer"
              />
              <ChevronDown
                size={18}
                className={`ml-2 text-[var(--color-text-1)] transition-transform ${
                  isDropdownOpen ? "rotate-180" : ""
                }`}
              />
            </div>

            {isDropdownOpen && (
              <ul className="absolute top-full mt-1 bg-[var(--color-box-1)] border border-gray-400 rounded-md shadow-lg w-full max-h-40 overflow-y-auto z-10">
                {filteredProjects.map((p) => (
                  <li
                    key={p.id}
                    className="p-2 hover:bg-[var(--color-box-2)] cursor-pointer"
                    onClick={() => {
                      setSelectedProject(`${p.id} - ${p.name}`);
                      setSearch("");
                      setIsDropdownOpen(false);
                    }}
                  >
                    {p.id} - {p.name}
                  </li>
                ))}
                {filteredProjects.length === 0 && (
                  <li className="p-2 text-gray-400">Nenhum projeto encontrado</li>
                )}
              </ul>
            )}
          </div>

          <div>
            <label className="block mb-2">Motivo:</label>
            <textarea
              rows={6}
              placeholder="Descreva o motivo do seu pedido de acesso..."
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="w-full p-3 rounded-md border border-gray-400 bg-[var(--color-box-1)] resize-none"
            />
          </div>

          <div className="flex items-center gap-4">
            <label>Acesso temporário</label>
            <button
              type="button"
              onClick={() => setIsTemporary(!isTemporary)}
              className={`cursor-pointer w-14 h-8 rounded-full transition-colors ${
                isTemporary
                  ? "bg-[var(--color-primary-1)]"
                  : "bg-[var(--color-box-1)]"
              } relative`}
            >
              <span
                className={`absolute top-1 left-1 w-6 h-6 bg-white rounded-full transition-transform ${
                  isTemporary ? "translate-x-6" : ""
                }`}
              ></span>
            </button>
          </div>

          <Button type="submit">Enviar Solicitação</Button>
        </form>
      </div>

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
