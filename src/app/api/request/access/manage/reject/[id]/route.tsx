import { rejectAccessRequest } from "@/services/access-request.service";
import { NextResponse } from "next/server";

interface Params {
  params: { id: number };
}
export async function PATCH(_: Request, { params }: Params) {
  try {
    const data = await rejectAccessRequest(params.id);
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
