"use client";
import { TKeySubjectResponse } from "@/lib/types";
import Table from "../../ui/table";
import Button from "../../ui/button";
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
  return (
    <>
      <div>
        <Table
        scroll={{ x: "max-content" }}
          dataSource={data?.map((item, i) => ({
            ...item,
            id: i + 1,
          }))}
          pagination={{ total }}
          columns={[
            {
              key: "S/N",
              title: "S/N",
              render: (_, { id }) => id,
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
                  <SellKeyBtn keySubjectAddress={record.keySubjectAddress} />
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
