import React, { useState } from "react";
import Table from "../../ui/table";
import Input from "../../ui/input";
import Button from "../../ui/button";
import BuyKeyBtn from "../buy-sell/BuyKeyBtn";
import UserProfile from "../profile/UserProfile";

type TCollection = {
  key: string;
  id: number;
  userName: string;
  subjectKeyAddress: string;
  userBalance: number;
  totalSupply: number;
  iskeyOwner: boolean;
  userId: string;
};
type TAction = "view";
const AccountsTable: React.FC<{ data?: TCollection[]; total?: number }> = ({
  data,
  total,
}) => {
  const [search, setSearch] = useState<string>();
  const [userId, setUserId] = useState<string>();
  const [action, setAction] = useState<TAction>();
  const handleAction = (action: TAction, id: string) => {
    setAction(action);

    setUserId(id);
  };
  return (
    <>
      <UserProfile
        title="User Profile"
        userId={userId}
        open={action === "view"}
        onClose={() => setAction(undefined)}
        disabled={true}
      />
      <div className="pt-4 pb-6">
        <div className="flex flex-col gap-6 py-2">
          <div className="flex self-end w-1/5">
            <Input.Search
              placeholder="Search User Accounts"
              allowClear
              onSearch={(value) => setSearch(value)}
            />
          </div>
          <Table
            scroll={{ x: "max-content" }}
            pagination={{ total }}
            dataSource={data?.filter((item) =>
              item.userName.toLowerCase().includes(search?.toLowerCase() || "")
            )}
            columns={[
              {
                key: "S/N",
                title: "S/N",
                render: (_, record) => record.id,
              },
              {
                key: "Username",
                title: "Username",
                render: (_, record, index) => <span>{record.userName}</span>,
              },
              {
                key: "Subject Key Address",
                title: "Subject Key Address",
                render: (_, record, index) => (
                  <span>{record.subjectKeyAddress}</span>
                ),
              },
              {
                key: "Key Owner",
                title: "Key Owner",
                render: (_, record, index) => (
                  <span>{record.iskeyOwner ? "Yes" : "No"}</span>
                ),
              },
              {
                key: "Total Supply",
                title: "Total Supply",
                render: (_, record, index) => <span>{record.totalSupply}</span>,
              },
              {
                key: "User Balance",
                title: "User Balance",
                render: (_, record, index) => <span>{record.userBalance}</span>,
              },
              {
                key: "actions",
                title: "",
                render: (_, record) => (
                  <div className="flex gap-4">
                    <BuyKeyBtn
                      keySubjectAddress={record.subjectKeyAddress}
                      disabled={record.iskeyOwner === false}
                    />
                    <Button
                      type="dashed"
                      onClick={() => handleAction("view", record.userId)}
                    >
                      View Profile
                    </Button>
                  </div>
                ),
              },
            ]}
            size="small"
          />
        </div>
      </div>
    </>
  );
};

export default AccountsTable;
