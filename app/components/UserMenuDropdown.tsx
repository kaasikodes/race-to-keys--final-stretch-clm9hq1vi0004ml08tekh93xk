"use client";

import React from "react";
import Dropdown from "./ui/dropdown";
import Avatar from "./ui/avatar";
import { generateRandomAvatarUrl } from "@/lib/utils";
import type { MenuProps } from "antd";
const UserMenuDropdown: React.FC<{
  avatarUrl?: string | null;
  userName?: string | null;
  menuItems?: MenuProps["items"];
}> = ({ avatarUrl, userName, menuItems = [] }) => {
  return (
    <Dropdown
      trigger={["click"]}
      menu={{ items: menuItems, className: "w-32" }}
    >
      <Avatar
        src={avatarUrl ?? generateRandomAvatarUrl({ name: userName })}
        shape="circle"
        size={`default`}
        className="cursor-pointer "
      />
    </Dropdown>
  );
};

export default UserMenuDropdown;
