"use client";
import { TKeySubjectResponse } from "@/lib/types";
import Table from "../../ui/table";
import Button from "../../ui/button";
import Input from "../../ui/input";

import { truncateString } from "@/lib/utils";
import { useState } from "react";
import BuyKeyBtn from "./BuyKeyBtn";
import SellKeyBtn from "./SellKeyBtn";

type TAction = "buy" | "sell";
const KeyHoldersTable: React.FC<{
  data?: (TKeySubjectResponse["data"]["allKeySubjects"]["data"][0] & {
    id?: number;
  })[];
  total?: number;
}> = ({ data, total }) => {
  const [search, setSearch] = useState<string>();

  return (
    <>
      <div className="flex flex-col gap-6 py-2">
        <div className="flex self-end w-1/5">
          <Input.Search
            placeholder="Search by username or address"
            value={search}
            allowClear
            onSearch={(value) => setSearch(value)}
          />
        </div>
        <Table
          scroll={{ x: "max-content" }}
          dataSource={data
            ?.map((item, i) => ({
              ...item,
              id: i + 1,
            }))
            .filter(
              (item) =>
                item.user?.name
                  .toLowerCase()
                  .includes(search?.toLowerCase() || "") ||
                item.keySubjectAddress
                  .toLowerCase()
                  .includes(search?.toLowerCase() || "")
            )}
          pagination={{ total }}
          columns={[
            {
              key: "S/N",
              title: "S/N",
              render: (_, { id }) => id,
            },
            {
              key: "Username",
              title: "Username",
              render: (_, record, index) => (
                <span>{record.user?.username ?? "N/A"}</span>
              ),
            },
            {
              key: "Subject Address",
              title: "Subject Address",
              render: (_, record) => record.keySubjectAddress,
            },
            {
              key: "Total Keys Owned",
              title: "Total Keys Owned",
              render: (_, record) => record.keys,
            },
            {
              key: "actions",
              title: "",
              render: (_, record) => (
                <div className="flex gap-4">
                  <BuyKeyBtn keySubjectAddress={record.keySubjectAddress} />
                  <SellKeyBtn
                    keySubjectAddress={record.keySubjectAddress}
                    disabled={record.keys === 0}
                  />
                </div>
              ),
            },
          ]}
        />
      </div>
    </>
  );
};

export default KeyHoldersTable;
