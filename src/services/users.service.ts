import { createClient } from "@/utils/supabase/client";

export interface IUser {
    id: string;
    name: string;
    email: string;
    role: string;
}

export const getUsers = async ()=> {
    const supabase = await createClient();
    const { data, error } = await supabase.from("profiles").select("*").order("id");

    if(error) throw new Error(error.message);
    return data ?? [];
}