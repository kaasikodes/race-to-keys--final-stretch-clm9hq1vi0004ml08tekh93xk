import { ContractTradeEvent, THistoryResponse } from "@/lib/types";
import Table from "../../ui/table";
import { truncateString } from "@/lib/utils";
import { useState } from "react";
import Input from "../../ui/input";

const HistoryTable: React.FC<{
  data?: (THistoryResponse["data"]["allHistory"]["data"][0] & {
    id?: number;
  })[];
  total?: number;
}> = ({ data, total }) => {
  const [search, setSearch] = useState<string>();

  return (
    <div className="flex flex-col gap-6 py-2">
      <div className="flex self-end w-1/5">
        <Input.Search
          placeholder="Search by username/trader/subject"
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
              item.data.trader
                .toLowerCase()
                .includes(search?.toLowerCase() || "") ||
              item.data.subject
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
            key: "Sequence Number",
            title: "Sequence Number",
            render: (_, record) => record.sequence_number,
          },
          {
            key: "Username",
            title: "Username",
            render: (_, record, index) => (
              <span>{record.user?.username ?? "N/A"}</span>
            ),
          },
          {
            key: "Trader",
            title: "Trader",
            render: (_, record) => truncateString(record.data.trader, 14),
          },
          {
            key: "Type",
            title: "Type",
            render: (_, record) => truncateString(record.type, 14),
          },
          {
            key: "Subject",
            title: "Subject",
            render: (_, record) => truncateString(record.data.subject, 14),
          },
          {
            key: "New Supply",
            title: "New Supply",
            render: (_, record) =>
              truncateString(`${record.data.new_supply}`, 14),
          },

          {
            key: "Transaction",
            title: "Transaction",
            render: (_, record) => `${record.data.is_buy ? "Bought" : "Sold"}`,
          },
          {
            key: "Key Amount",
            title: "Key Amount",
            render: (_, record) =>
              truncateString(`${record.data.key_amount}`, 14),
          },
        ]}
      />
    </div>
  );
};

export default HistoryTable;
