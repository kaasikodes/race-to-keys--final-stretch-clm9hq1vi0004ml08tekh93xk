import { ContractTradeEvent } from "@/lib/types";
import Table from "../../ui/table";
import { truncateString } from "@/lib/utils";

const HistoryTable: React.FC<{
  data?: (ContractTradeEvent & { id?: number })[];
  total?: number;
}> = ({ data, total }) => {
  return (
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
            key: "Sequence Number",
            title: "Sequence Number",
            render: (_, record) => record.sequence_number,
          },
          {
            key: "Trader",
            title: "Trader",
            render: (_, record) => truncateString(record.data.trader, 14),
          },
          {
            key: "Type",
            title: "Type",
            render: (_, record) => record.type,
            ellipsis: true,
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
