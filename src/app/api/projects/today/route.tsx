import { getTodayProjects } from "@/services/projects.service";
import { NextResponse } from "next/server";

export async function GET() {
    try{
        const data = await getTodayProjects();

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
