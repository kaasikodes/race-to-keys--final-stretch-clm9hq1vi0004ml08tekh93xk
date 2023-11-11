import { prisma } from "@/config/database";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "../../auth/[...nextauth]/route";

export async function GET(request: Request) {
  const session = await getServerSession(authOptions);
  const user = await prisma.user.findFirst({
    where: {
      id: session?.user.id,
    },
    select: {
      privateKey: true,
      id: true,
      phone: true,
      name: true,
      email: true,
      image: true,
    },
  });
  const data = {
    user: {
      id: user?.id,
      phone: user?.phone,
      email: user?.email,
      name: user?.name,
      image: user?.image,
    },
    hasPrivateKey: !!user?.privateKey,
  };
  return NextResponse.json({
    message: "Authenticated user retrieved successfully!",
    data,
    success: true,
  });
}
