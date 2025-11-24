import { createClient } from "@/utils/supabase/client";

export const createAccess = async (projectId: number, userId: string, temporary: boolean) => {
  const supabase = await createClient();
 
  const { data, error } = await supabase
    .from("users_projects")
    .insert([
      {
        user_id: userId,
        project_id: projectId,
        active: true,
      },
    ])
    .select()
    .single();

  if (error) throw error;
  return data;
};