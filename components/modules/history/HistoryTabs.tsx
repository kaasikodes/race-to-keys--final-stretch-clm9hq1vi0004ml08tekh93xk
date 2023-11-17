import React from "react";
import Tabs from "../../ui/tabs";
import { THistoryResponse } from "@/lib/types";
import HistoryTable from "./HistoryTable";

const HistoryTabs: React.FC<{ data?: THistoryResponse }> = ({ data }) => {
  return (
    <div>
      <Tabs
        items={[
          {
            key: "My History",
            label: "My History",
            children: (
              <HistoryTable
                data={data?.data.userHistory.data}
                total={data?.data.userHistory.total}
              />
            ),
          },
          {
            key: "All History",
            label: "All History",
            children: (
              <HistoryTable
                data={data?.data.allHistory.data}
                total={data?.data.allHistory.total}
              />
            ),
          },
        ]}
      />
    </div>
  );
};

export default HistoryTabs;
