"use client";
import React from "react";
import PageHeader from "../../PageHeader";
import PageSubHeader from "../../PageSubHeader";
import HistoryTabs from "./HistoryTabs";
import { THistoryResponse } from "@/lib/types";

const HistoryContainer: React.FC<{ data?: THistoryResponse }> = ({ data }) => {
  return (
    <div className="my-5 flex flex-col gap-1">
      <PageHeader title="Trade History" />
      <PageSubHeader
        description={
          "View your trade history as well as that of every user on platform!"
        }
      />
      <HistoryTabs data={data} />
    </div>
  );
};

export default HistoryContainer;
