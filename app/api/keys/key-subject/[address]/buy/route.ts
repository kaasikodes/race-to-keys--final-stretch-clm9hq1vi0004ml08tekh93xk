import { userBuyKeys } from "@/app/action";
import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";

export async function POST(
  request: Request,
  { params }: { params: { address: string } }
) {
  const { amount } = await request.json();
  const response = await userBuyKeys({
    keySubjectAddress: params.address,
    amount,
  });
  revalidatePath(`/buy-sell`, "page");
  return NextResponse.json(response);
}
