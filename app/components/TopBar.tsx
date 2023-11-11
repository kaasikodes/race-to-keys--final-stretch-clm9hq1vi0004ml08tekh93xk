"use client";

import Image from "next/image";
import Link from "next/link";
import React from "react";
import { FaSearch, FaNetworkWired } from "react-icons/fa";
import { signIn, signOut, useSession } from "next-auth/react";
import { Button } from "antd";
import UserMenuDropdown from "./UserMenuDropdown";
import RouteMenu from "./RouteMenu";

import { BiLogOut } from "react-icons/bi";

const TopBar = () => {
  const { data: session } = useSession();
  return (
    <div className="bg-white w-full py-3 sticky top-0 z-50 text-accent shadow-lg">
      <div className="px-5 lg:px-12 flex items-center justify-between x-container">
        <div className="flex flex-1 items-center gap-3">
          <Link
            href="/"
            className={
              "transition-all duration-500 ease-in-out flex gap-2 items-center"
            }
          >
            <FaNetworkWired className="md:h-8 text-lg text-blue-500 " />
            <span className="text-slate-400">
              <span className="text-blue-500 font-bold">SO</span>fii
            </span>
          </Link>
          <RouteMenu isLoggedIn={!!session} />
        </div>

        {session && (
          <div className="flex gap-4 items-center">
            <FaSearch className="lg:hidden" />

            <div className="lg:flex items-center gap-6 hidden">
              <FaSearch className="text-blue-500 cursor-pointer" />

              <div className="flex items-center gap-2">
                <UserMenuDropdown
                  avatarUrl={session.user?.image}
                  userName={session.user.name}
                  menuItems={[
                    {
                      key: "profile",
                      label: "Profile",
                    },
                    {
                      key: "Tranfer Aptos",
                      label: "Tranfer Aptos",
                    },
                    {
                      key: "My History",
                      onClick: () => {},
                      label: "My History",
                    },
                    {
                      itemIcon: <BiLogOut />,

                      key: "logout",
                      onClick: () => signOut(),
                      label: "Logout",
                    },
                  ]}
                />
              </div>
            </div>
          </div>
        )}
        {!session && (
          <div className="lg:flex items-center gap-6 hidden">
            <Button type="text" onClick={() => signIn("twitter")}>
              Login
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default TopBar;
