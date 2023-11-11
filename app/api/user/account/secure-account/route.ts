import { prisma } from "@/config/database";
import { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "../../../auth/[...nextauth]/route";
import { SecurePrivateKeyProps } from "@/lib/types";
import {
  createAptosAccount,
  decrypt,
  encrypt,
  newPrivateKey,
} from "@/lib/utils";
import bcrypt from "bcrypt";
import ENV from "@/config/enviroment";

const SALT_ROUND = 10;
export async function GET(request: Request) {
  const session = await getServerSession(authOptions);
  const hasAptosAccountAndPrivateKey =
    !!session?.user.hasAptosAccountAndPrivateKey;

  if (hasAptosAccountAndPrivateKey) {
    return NextResponse.json({
      message: "Private Key has already been secured!",
      user: session?.user,
      success: false,
    });
  }
  //   create private key & aptos account
  const privateKey = newPrivateKey();
  const aptosAcccount = createAptosAccount(privateKey);
  //   encrypt private key using catchprases & secret

  //   encrypt private key using accesscode & secret
  // create and save the private key in the database
  const privateKeyEncryptedWithAccessCode = await bcrypt.hash(
    `${privateKey}`,
    SALT_ROUND
  );
  const privateKeyEncryptedWithCatchPhrases = await bcrypt.hash(
    `${privateKey}`,
    SALT_ROUND
  );

  const privateKeyEncryptedWithSecret = encrypt(privateKey);
  const dbPrivateKey = await prisma.privateKey.create({
    data: {
      value_via_catch_phrases: privateKeyEncryptedWithCatchPhrases,
      value_via_password: privateKeyEncryptedWithSecret,
      userId: session?.user.id,
      // value_via_secret: privateKeyEncryptedWithSecret
    },
  });

  return NextResponse.redirect(new URL("/home", request.url));
}
