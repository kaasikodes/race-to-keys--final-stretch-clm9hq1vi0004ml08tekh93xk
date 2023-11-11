"use client";

import { TKeySubjectResponse } from "@/lib/types";
import PageHeader from "../../PageHeader";
import PageSubHeader from "../../PageSubHeader";
import KeyHoldersTable from "./KeyHoldersTable";

const BuyOrSellContainer: React.FC<{
  data?: TKeySubjectResponse["data"]["userKeySubjects"];
}> = ({ data }) => {
  return (
    <div className="my-5 flex flex-col gap-1">
      <PageHeader title="Buy/Sell" />
      <PageSubHeader description={"Buy or Sell Keys within the application"} />
      <KeyHoldersTable data={data?.data} total={data?.total} />
    </div>
  );
};

export default BuyOrSellContainer;
