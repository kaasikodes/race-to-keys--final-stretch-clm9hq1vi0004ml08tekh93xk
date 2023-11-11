import React from "react";
import Table from "../../ui/table";
import { TOwnedCollection } from "@/lib/types";

const MyOwnedCollectionsCard: React.FC<{
  data?: TOwnedCollection[];
  total?: number;
}> = ({ data, total }) => {
  return (
    <div className="bg-mainBg  border rounded-lg text-sm shadow pt-4 pb-6 flex-1">
      <div className="flex items-center justify-between px-5 py-3 border-b">
        <p className="font-medium">{`My Owned Collections`}</p>
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
              key: "Collection Address",
              title: "Collection Address",
              render: (_, record, index) => (
                <span>{record.collectionAddress}</span>
              ),
            },
            {
              key: "Keys Owned",
              title: "Keys Owned",
              render: (_, record, index) => <span>{record.keysOwned}</span>,
            },
          ]}
          size="small"
        />
      </div>
    </div>
  );
};

export default MyOwnedCollectionsCard;
