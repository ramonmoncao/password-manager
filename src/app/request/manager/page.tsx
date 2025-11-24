"use client";
import Button from "@/components/button";
import Modal from "@/components/modal";
import Notification, { NotificationProps } from "@/components/notification";
import {
  acceptAccessRequest,
  getPendingAccessRequest,
  IAccessRequest,
  rejectAccessRequest,
} from "@/services/access-request.service";
import { createClient } from "@/utils/supabase/client";
import { Lock, Unlock } from "lucide-react";
import { act, useEffect, useState } from "react";

export default function ManageRequest() {
  const supabase = createClient();
  const [user, setUser] = useState<any>(null);
  const [isLoading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [requests, setRequests] = useState<IAccessRequest[] | []>([]);
  const [notifications, setNotifications] = useState<NotificationProps[]>([]);
  const [selectedRequest, setSelectedRequest] =
    useState<IAccessRequest | null>();
  const [action, setAction] = useState<"aceitar" | "recusar">();
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const getUser = async () => {
      const { data } = await supabase.auth.getUser();
      setUser(data.user);
    };
    getUser();
  }, []);

  useEffect(() => {
    if (!user?.id) return;

    const getMyRequestsToManage = async () => {
      try {
        setLoading(true);
        const data = await getPendingAccessRequest(user.id);
        setRequests(data);
      } catch (err: any) {
        showNotification(err.message || String(err), "error");
        setError(err.message || "Erro ao carregar solicitações");
      } finally {
        setLoading(false);
      }
    };

    getMyRequestsToManage();
  }, [user?.id]);
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

  const getDate = (isoDate: string) => {
    const date = new Date(isoDate);
    return date.toLocaleString("pt-BR");
  };

  const handleAccept = async (id: number) => {
    console.log("DATA:", id);
    try {
      await acceptAccessRequest(id);
      setRequests((prev) => prev.filter((r) => r.id !== id));
      showNotification("Solicitação aceita com sucesso", "success");
    } catch (err: any) {
      showNotification(err.message || "Erro ao aceitar", "error");
    }
  };

  const handleReject = async (id: number) => {
    try {
      await rejectAccessRequest(id);
      setRequests((prev) => prev.filter((r) => r.id !== id));
      showNotification("Solicitação recusada com sucesso", "success");
    } catch (err: any) {
      showNotification(err.message || "Erro ao recusar", "error");
    }
  };

const handleAction = async (request: IAccessRequest) => {
  if (action === "aceitar") {
    await handleAccept(request.id);
  }
  if (action === "recusar") {
    await handleReject(request.id);
  }
  setSelectedRequest(null);
};

  return (
    <div className="flex-1 bg-[var(--color-box-3)] shadow-md h-full rounded-tr-3xl p-10 mr-6 flex justify-center items-start">
      <div className="w-full max-w-5xl flex flex-col justify-center gap-6">
        <h2 className="text-3xl font-semibold text-[var(--color-primary-1)] mb-6 text-center">
          Gerenciar Solicitações
        </h2>

        <table className="min-w-full divide-y">
          <thead className="bg-[var(--color-primary-1)]">
            <tr>
              <th className="px-4 pt-3 whitespace-nowrap text-left text-sm text-white w-12">
                #
              </th>
              <th className="px-4 py-3 whitespace-nowrap text-left text-sm text-white">
                Nome do Projeto
              </th>
              <th className="px-4 py-3 whitespace-nowrap text-left text-sm text-white">
                Nome do Usuário
              </th>
              <th className="px-4 py-3 whitespace-nowrap text-left text-sm text-white">
                Data de Solicitação
              </th>
              <th className="px-4 py-3 whitespace-nowrap text-left text-sm text-white">
                Tipo
              </th>
              <th className="px-4 py-3 whitespace-nowrap text-left text-sm text-white">
                Razão
              </th>
              <th className="px-4 py-3 whitespace-nowrap text-left text-sm text-white">
                Ação
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 bg-[var(--color-box-2)]">
            {isLoading ? (
              <tr>
                <td className="px-4 py-3 text-center text-gray-500" colSpan={6}>
                  Carregando Solicitações...
                </td>
              </tr>
            ) : error ? (
              <tr>
                <td className="px-4 py-3 text-center text-red-500" colSpan={6}>
                  Erro: {error}
                </td>
              </tr>
            ) : requests.length === 0 ? (
              <tr>
                <td className="px-4 py-3 text-center text-gray-700" colSpan={6}>
                  Nenhuma Solicitação encontrada.
                </td>
              </tr>
            ) : (
              requests.map((request, index) => (
                <tr key={request.id} className="hover:bg-[var(--color-box-1)]">
                  <td className="px-4 pt-3 whitespace-nowrap text-sm text-[var(--color-text-1)]">
                    {index + 1}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-[var(--color-text-1)]">
                    {request.project_group_name}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-[var(--color-text-1)]">
                    {request.user_name}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-[var(--color-text-1)]">
                    {getDate(request.created_at)}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-[var(--color-text-1)]">
                    {request.temporary ? "temporário" : "definitivo"}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-[var(--color-text-1)]">
                    {request.reason}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-[var(--color-text-1)]">
                    <div className="flex gap-4">
                      <button
                        onClick={() => (
                          setSelectedRequest(request),
                          setIsOpen(true),
                          setAction("aceitar")
                        )}
                        className="text-[var(--color-primary-1)] hover:scale-110 transition-transform cursor-pointer"
                      >
                        <Unlock size={20} />
                      </button>

                      <button
                        onClick={() => (
                          setSelectedRequest(request),
                          setIsOpen(true),
                          setAction("recusar")
                        )}
                        className="text-red-500 hover:scale-110 transition-transform cursor-pointer"
                      >
                        <Lock size={20} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      {isOpen && (
        <Modal
          isOpen={isOpen}
          onClose={() => setIsOpen(false)}
          buttons={[
            {
              label: "Sim",
              onClick: async () => {
                if (!selectedRequest) return;
                await handleAction(selectedRequest);
                setIsOpen(false);
              },
              className: "bg-transparent cursor-pointer",
            },
            {
              label: "Não",
              onClick: () => setIsOpen(false),
              className: "bg-red-500 text-white cursor-pointer",
            },
          ]}
        >
          Você tem certeza que deseja {action} o acesso do usuário{" "}
          {selectedRequest?.user_name}?
        </Modal>
      )}
      {/* 🔹 Notificações */}
      <div className="fixed bottom-4 right-4 flex flex-col gap-2 z-50">
        {notifications.map((n) => (
          <Notification key={n.id} {...n} />
        ))}
      </div>
    </div>
  );
}
