import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";
import { NextResponse } from "next/server";
import { ContractTradeEvent, User } from "@/lib/types";
import {
  getAptosBalance,
  getOwnedCollections,
  getProtocolFeePercentage,
  getSubjectFeePercentage,
  getTradeHistory,
} from "@/lib/contract";
import { prisma } from "@/config/database";
import { createAptosAccount, decrypt } from "@/lib/utils";
import { getUserDBData } from "@/app/action";

export async function GET(request: Request) {
  const response = await getUserDBData();

  return NextResponse.json(response);
}
