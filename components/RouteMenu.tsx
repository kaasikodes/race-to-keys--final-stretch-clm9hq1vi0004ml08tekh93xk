"use client";
import { usePathname } from "next/navigation";
import Menu from "./ui/menu";
import Link from "next/link";

const RouteMenu: React.FC<{ isLoggedIn: boolean }> = ({ isLoggedIn }) => {
  const pathname = usePathname();
  console.log(pathname, "PATHNAME");
  if (!isLoggedIn) {
    return null;
  }
  return (
    <Menu
      defaultValue={pathname}
      mode="horizontal"
      className="flex-1 justify-center mb-0 border-none  bg-transparent"
      items={[
        {
          key: `/dashboard`,
          label: <Link href={`/dashboard`}>Dashboard</Link>,
        },
        {
          key: `/account`,
          label: <Link href={`/account`}>Accounts</Link>,
        },
        {
          key: `/buy-sell`,
          label: <Link href={`/buy-sell`}>Buy/Sell</Link>,
        },

        {
          key: `/history`,
          label: <Link href={`/history`}>Trade History</Link>,
        },
      ]}
    />
  );
};

export default RouteMenu;
