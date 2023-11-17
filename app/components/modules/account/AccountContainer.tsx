"use client";

import { TGetUserAccountsResponse } from "@/lib/types";
import PageHeader from "../../PageHeader";
import PageSubHeader from "../../PageSubHeader";
import AccountsTable from "./AccountsTable";

const AccountContainer: React.FC<{
  data?: TGetUserAccountsResponse["data"];
}> = ({ data }) => {
  return (
    <div className="my-5 flex flex-col gap-1">
      <PageHeader title="Accounts" />
      <PageSubHeader
        description={"Manage your account and view other accounts"}
      />
      <AccountsTable
        data={data?.data.map((item, i) => ({
          id: i + 1,
          userId: item.userId,
          userName: item.user.username,
          key: item.address,
          iskeyOwner: item.isKeyInitialized,
          subjectKeyAddress: item.address,
          totalSupply: item.keySupply,
          userBalance: item.userKeyBalance,
        }))}
        total={data?.total}
      />
    </div>
  );
};

export default AccountContainer;
