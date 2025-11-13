import { getUserProjectGroups } from "@/services/project-group.service";
import { NextResponse } from "next/server";


interface Params {
  params: { id: string };
}
export async function GET(_: Request, { params }: Params) {
  try {
    const data = await getUserProjectGroups(params.id);
    return NextResponse.json(
      {
        sucess: true,
        count: data.length,
        data,
      },
      { status: 200 }
    );
  } catch (e: any) {
    return NextResponse.json(
      {
        sucess: false,
        error: e.message ?? "Erro inesperado",
      },
      { status: 404 }
    );
  }
}