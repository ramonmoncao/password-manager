import { NextResponse } from "next/server";
import { getUsers } from "@/services/users.service";

export async function GET() {
    try{
        const data = await getUsers();

        return NextResponse.json({
            sucess: true,
         count: data.length,
            data,
        }, { status: 200 });
    } catch (e: any) {
        return NextResponse.json({
            sucess: false,
            error: e.message ?? "Erro inesperado",
        }, { status: 400});
    }
}