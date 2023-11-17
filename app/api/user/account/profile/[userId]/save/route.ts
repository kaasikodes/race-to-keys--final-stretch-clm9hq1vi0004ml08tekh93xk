import { updateUserData, userBuyKeys } from "@/app/action";
import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";

export async function POST(
  request: Request,
  { params }: { params: { userId: string } }
) {
  const { userId } = params;
  const { email, phone } = await request.json();
  const response = await updateUserData({
    userId,
    email,
    phone,
  });
  revalidatePath(`/dashboard`, "page");
  return NextResponse.json(response);
}
