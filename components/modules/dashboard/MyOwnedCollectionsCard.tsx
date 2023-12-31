import React from "react";
import Table from "../../ui/table";
import { TDBResponse, TOwnedCollection } from "@/lib/types";
import SellKeyBtn from "../buy-sell/SellKeyBtn";

const MyOwnedCollectionsCard: React.FC<{
  data?: TDBResponse["data"]["ownedCollections"]["data"];
  total?: number;
}> = ({ data, total }) => {
  return (
    <div className="  border rounded-lg text-sm shadow pt-4 pb-6 flex-1">
      <div className="flex items-center justify-between px-5 py-3 border-b">
        <p className="font-medium text-black">{`My Owned Collections`}</p>
      </div>
      <div className="flex flex-col gap-3 px-5 py-2">
        <Table
          scroll={{ x: "max-content" }}
          pagination={{ total, pageSize: 5 }}
          dataSource={data}
          columns={[
            {
              key: "S/N",
              title: "S/N",
              render: (_, record, index) => index + 1,
            },
            {
              key: "Username",
              title: "Username",
              render: (_, record, index) => (
                <span>{record.user?.username ?? "N/A"}</span>
              ),
            },
            {
              key: "Collection Address",
              title: "Collection Address",
              ellipsis: true,
              render: (_, record, index) => (
                <span>{record.collectionAddress}</span>
              ),
            },
            {
              key: "Keys Owned",
              title: "Keys Owned",
              render: (_, record, index) => <span>{record.keysOwned}</span>,
            },
            {
              key: "actions",
              title: "",
              render: (_, record) => (
                <div className="flex gap-4">
                  <SellKeyBtn keySubjectAddress={record.collectionAddress} />
                </div>
              ),
            },
          ]}
          size="small"
        />
      </div>
    </div>
  );
};

export default MyOwnedCollectionsCard;
