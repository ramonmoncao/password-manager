import { createClient } from "@/utils/supabase/client";

export interface IAccessRequest {
  id: number;
  id_user: string;
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
  const { data: existing, error: selectError } = await supabase
    .from("access_request")
    .select("*")
    .eq("id_user", request.id_user)
    .eq("id_project_group", request.id_project)
    .eq("active", true)
    .order("id");

  const {data: project} = await supabase.from("project_group")
  .select("*")
  .eq("id", request.id_project)
  .single();

  if (existing && existing.length > 0) throw new Error("Solicitação já existente");
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
