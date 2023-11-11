"use client";
import Link from "next/link";
import { signIn, signOut, useSession } from "next-auth/react";

export const NavMenu = () => {
  const { data: session } = useSession();
  if (session) {
    return (
      <div className="px-2 py-2 flex gap-4 items-center border-b">
        <span>{session.user?.name}</span>
        <button className="bg-blue-500 px-4 py-3" onClick={() => signOut()}>
          Sign out
        </button>
      </div>
    );
  }
  return (
    <div>
      <button className="bg-blue-500 px-4 py-3" onClick={() => signIn()}>
        Sign in
      </button>
    </div>
  );
};
