"use client";

import Image from "next/image";
import Link from "next/link";
import React, { useState } from "react";
import { FaSearch, FaNetworkWired } from "react-icons/fa";
import { signIn, signOut, useSession } from "next-auth/react";
import { Button } from "antd";
import UserMenuDropdown from "./UserMenuDropdown";
import RouteMenu from "./RouteMenu";
import { BiLogOut } from "react-icons/bi";
import UserProfile from "./modules/profile/UserProfile";
import TransferAptos from "./modules/profile/TransferAptos";
import ViewPrivateKey from "./modules/profile/ViewPrivateKey";

type TAction = "view-profile" | "transfer-aptos" | "view-private-key";

const TopBar = () => {
  const { data: session } = useSession();
  const [userId, setUserId] = useState<string>();
  const [action, setAction] = useState<TAction>();
  const handleAction = (action: TAction, id?: string) => {
    setAction(action);

    setUserId(id);
  };
  const handleClose = () => setAction(undefined);
  return (
    <>
      <UserProfile
        title="My Profile"
        userId={userId}
        open={action === "view-profile"}
        onClose={handleClose}
        disabled={false}
      />
      <TransferAptos
        title="Transfer Aptos"
        open={action === "transfer-aptos"}
        onClose={handleClose}
      />
      <ViewPrivateKey
        title="View Private key"
        open={action === "view-private-key"}
        onClose={handleClose}
      />
      <div className="bg-white w-full py-3 sticky top-0 z-50 text-accent shadow-lg">
        <div className="px-5 lg:px-12 flex items-center justify-between x-container">
          <div className="flex flex-1 items-center gap-3">
            <Link
              href="/dashboard"
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
                        key: "My Profile",
                        label: "My Profile",
                        onClick: () =>
                          handleAction("view-profile", session.user.id),
                      },
                      {
                        key: "Private Key",
                        label: "Private Key",
                        onClick: () => handleAction("view-private-key"),
                      },
                      {
                        key: "Tranfer Aptos",
                        label: "Tranfer Aptos",
                        onClick: () => handleAction("transfer-aptos"),
                      },
                      {
                        key: "My History",
                        label: <Link href={`/history`}>My History</Link>,
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
    </>
  );
};

export default TopBar;
