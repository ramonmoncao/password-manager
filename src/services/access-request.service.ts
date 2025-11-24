import { createClient } from "@/utils/supabase/client";
import { sendEmailById } from "./send-email.service";
import { createAccess } from "./users-projects.service";

export interface IAccessRequest {
  id: number;
  id_user: string;
  user_name: string;
  id_project: number;
  reason: string;
  created_at: string;
  temporary: boolean;
  accepted: boolean;
  active: boolean;
  project_group_name: string;
}

export const getAccessRequest = async () => {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("access_request")
    .select("*")
    .order("id");

  if (error) throw new Error(error.message);
  return data ?? [];
};

export const getAccessRequestByUserId = async (id: string) => {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("access_request")
    .select("*")
    .eq("id_user", id)
    .order("id");

  if (error) throw new Error(error.message);
  return data ?? [];
};

export const createAccessRequest = async (request: Partial<IAccessRequest>) => {
  const supabase = await createClient();
  const { data: existingRequest, error: requestError } = await supabase
    .from("access_request")
    .select("*")
    .eq("id_user", request.id_user)
    .eq("id_project_group", request.id_project)
    .eq("active", true)
    .order("id");

  const { data: existingAcess, error: acessError } = await supabase
    .from("users_projects")
    .select("*")
    .eq("user_id", request.id_user)
    .eq("project_id", request.id_project)
    .eq("active", true)

  const {data: project} = await supabase.from("project_group")
  .select("*")
  .eq("id", request.id_project)
  .single();

  if (existingRequest && existingRequest.length > 0) throw new Error("Solicitação já existente");
  if(existingAcess && existingAcess.length > 0) throw new Error("Acesso já existente");

  const adminId : string = project.id_admin;
  sendEmailById({
    id: adminId,
    subject: "Solicitação de acesso",
    text: "Nova Solicitação de acesso"
  });

  const { data, error } = await supabase
    .from("access_request")
    .insert([
      {
        id_user: request.id_user,
        id_project_group: request.id_project,
        reason: request.reason,
        temporary: request.temporary,
        project_group_name: project.name
      },
    ])
    .select()
    .single();

  if (error) throw error;
  return data;
};


export const getPendingAccessRequest = async (admin_id: string): Promise<IAccessRequest[]> => {
  const supabase = await createClient();

  const { data, error } = await supabase
    .rpc("get_access_request_to_accept", { admin_id });

  if (error) {
    console.error("Erro ao buscar access requests via RPC:", error);
    return [];
  }

  return data as IAccessRequest[];
};

export const acceptAccessRequest = async (id: number) => {
  const supabase = await createClient();
  const { data: updatedRequest, error: updateError } = await supabase
    .from("access_request")
    .update({
      active: false,
      accepted: true,
    })
    .eq("id", id)
    .select()
    .single(); 

  if (updateError) throw updateError;
  if (!updatedRequest) throw new Error("Solicitação não encontrada");

  await createAccess(
    updatedRequest.id_project_group,
    updatedRequest.id_user,
    updatedRequest.temporary
  );

  return updatedRequest;
};


export const rejectAccessRequest = async(id: number) => {
  const supabase = await createClient();

  const {data, error} = await supabase
  .from("access_request")
  .update({
    active: false,
    accepted: false
  })
  .eq("id", id)

}