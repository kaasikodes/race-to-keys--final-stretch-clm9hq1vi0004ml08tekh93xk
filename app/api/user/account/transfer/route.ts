import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/config/database";
import { transferAptosTo } from "@/lib/contract";
import { createAptosAccount, decrypt } from "@/lib/utils";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  const privateKey = await prisma.privateKey.findFirst({
    where: {
      userId: session?.user.id,
    },
  });
  if (!!privateKey === false) {
    return NextResponse.json({
      message: "Private Key not found",
      success: false,
    });
  }
  const privateKeyValue = decrypt(
    privateKey?.value_via_password as unknown as string
  );
  const body = (await request.json()) as unknown as {
    amount: number;
    address: string;
  };
  const aptosAcccount = createAptosAccount(privateKeyValue);
  const receiver = body.address;
  await transferAptosTo(aptosAcccount, receiver, body.amount);
  return NextResponse.json({
    message: "Tranfer successful",

    success: true,
  });
}
