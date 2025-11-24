"use client";
import { NotificationProps } from "@/components/notification";
import {
  getAccessRequestByUserId,
  IAccessRequest,
} from "@/services/access-request.service";
import { createClient } from "@/utils/supabase/client";
import { useEffect, useState } from "react";

export default function MyRequests() {
  const supabase = createClient();
  const [user, setUser] = useState<any>(null);
  const [isLoading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [requests, setRequests] = useState<IAccessRequest[] | []>([]);
  const [notifications, setNotifications] = useState<NotificationProps[]>([]);

  useEffect(() => {
    const getUser = async () => {
      const { data } = await supabase.auth.getUser();
      setUser(data.user);
    };
    getUser();
  }, []);

  useEffect(() => {
    if (!user?.id) return;

    const getMyRequests = async () => {
      try {
        setLoading(true);
        const data = await getAccessRequestByUserId(user.id);
        setRequests(data);
      } catch (err: any) {
        showNotification(err.message || String(err), "error");
        setError(err.message || "Erro ao carregar solicitações");
      } finally {
        setLoading(false);
      }
    };

    getMyRequests();
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

  return (
    <div className="flex-1 bg-[var(--color-box-3)] shadow-md h-full rounded-tr-3xl p-10 mr-6 flex justify-center items-start">
      <div className="w-full max-w-5xl flex flex-col justify-center gap-6">
        <h2 className="text-3xl font-semibold text-[var(--color-primary-1)] mb-6 text-center">
          Minhas solicitações
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
                Data de Solicitação
              </th>
              <th className="px-4 py-3 whitespace-nowrap text-left text-sm text-white">
                Tipo
              </th>
              <th className="px-4 py-3 whitespace-nowrap text-left text-sm text-white">
                Razão
              </th>
              <th className="px-4 py-3 whitespace-nowrap text-left text-sm text-white">
                Situação
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
                    {getDate(request.created_at)}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-[var(--color-text-1)]">
                    {request.temporary ? "temporário" : "definitivo"}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-[var(--color-text-1)]">
                    {request.reason}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-[var(--color-text-1)]">
                    {request.accepted && !request.active
                      ? "Ativo"
                      : !request.accepted && !request.active
                      ? "Rejeitado"
                      : "Aguardando resposta"}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
