import { NextResponse } from "next/server";
import { getProjects } from "@/services/projects.service";

export async function GET() {
    try{
        const data = await getProjects();

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
