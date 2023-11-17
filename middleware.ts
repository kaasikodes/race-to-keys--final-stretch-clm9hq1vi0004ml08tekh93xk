import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "./app/api/auth/[...nextauth]/route";
import { prisma } from "./config/database";
import { withAuth } from "next-auth/middleware";
import ENV from "./config/enviroment";
import { APP_ROUTES } from "./app/constants/routes";

// This function can be marked `async` if using `await` inside
// export async function middleware(request: NextRequest) {
//   // const session = await fetch(`http://127.0.0.1:3000/api/user/auth`);

//   console.log("LA LA", session);

//   // console.log("LA LA", user);
//   return NextResponse.next();
//   //   return NextResponse.redirect(new URL("/home", request.url));
// }

export default withAuth(
  // `withAuth` augments your `Request` with the user's token.
  async function middleware(request) {
    const session = request?.nextauth?.token;
    const hasAptosAccountAndPrivateKey = session?.hasAptosAccountAndPrivateKey;

    if (session && request.nextUrl.pathname === "/auth/login")
      return NextResponse.redirect(new URL("/dashboard", request.url));

    if (hasAptosAccountAndPrivateKey) {
      return NextResponse.next();
    }

    return NextResponse.redirect(
      new URL("/api/user/account/secure-account", request.url)
    );
    // console.log("LA LA", session);

    // console.log("LA LA", user);
    //   return NextResponse.redirect(new URL("/home", request.url));
  },
  {
    secret: ENV.NEXTAUTH_SECRET,
  }
);

// See "Matching Paths" below to learn more
export const config = {
  matcher: [
    "/",
    "/home",
    "/account",
    "/buy-sell",
    "/history",
    "/api/dashboard/:path*",
    "/api/keys/:path*",
    "/api/user/auth/:path*",
    "/api/user/account/private-key/:path*",
    "/api/user/account/profile/:path*",
    "/api/user/account/transfer/:path*",
  ],
};
