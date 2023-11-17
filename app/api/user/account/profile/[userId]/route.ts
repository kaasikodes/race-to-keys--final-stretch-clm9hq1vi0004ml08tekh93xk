import { getUserData } from "@/app/action";
import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  { params }: { params: { userId: string } }
) {
  const { userId } = params;

  const response = await getUserData({ userId });
  return NextResponse.json(response);
}
