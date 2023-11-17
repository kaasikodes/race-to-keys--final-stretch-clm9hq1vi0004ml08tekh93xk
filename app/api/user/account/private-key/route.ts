import { getAuthUserPrivateKey } from "@/app/action";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const response = await getAuthUserPrivateKey();
  return NextResponse.json(response);
}
