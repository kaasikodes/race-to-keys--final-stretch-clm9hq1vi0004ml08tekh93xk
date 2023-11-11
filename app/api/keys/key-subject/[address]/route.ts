import { getKeySubjectDetails } from "@/app/action";
import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  { params }: { params: { address: string } }
) {
  const { searchParams } = new URL(request.url);
  const buyAmount = searchParams.get("buyAmount");
  const sellAmount = searchParams.get("sellAmount");
  const response = await getKeySubjectDetails({
    keySubjectAddress: params.address,
    buyAmount: buyAmount ? +buyAmount : undefined,
    sellAmount: sellAmount ? +sellAmount : undefined,
  });
  return NextResponse.json(response);
}
