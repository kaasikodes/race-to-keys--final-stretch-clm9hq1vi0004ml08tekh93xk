import Menu from "./ui/menu";
import Link from "next/link";

const RouteMenu: React.FC<{ isLoggedIn: boolean }> = ({ isLoggedIn }) => {
  if (!isLoggedIn) {
    return null;
  }
  return (
    <Menu
      mode="horizontal"
      className="flex-1 justify-center mb-0 border-none  bg-transparent"
      items={[
        {
          key: "Dashboard",
          label: <Link href={`/dashboard`}>Dashboard</Link>,
        },
        {
          key: "Accounts",
          label: <Link href={`/account`}>Accounts</Link>,
        },
        {
          key: "Buy",
          label: <Link href={`/buy-sell`}>Buy/Sell</Link>,
        },

        {
          key: "History",
          label: <Link href={`/history`}>Trade History</Link>,
        },
      ]}
    />
  );
};

export default RouteMenu;
