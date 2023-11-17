"use client";
import { useSession } from "next-auth/react";
import React, { useEffect } from "react";
import UserInfoDBCard from "./UserInfoDBCard";
import { Skeleton } from "antd";
import MyRecentHistoryCard from "./MyRecentHistoryCard";
import ProtocolFeeCard from "./ProtocolFeeCard";
import MyOwnedCollectionsCard from "./MyOwnedCollectionsCard";
import { TDBResponse } from "@/lib/types";
import { useRouter } from "next/navigation";

const DBContainer: React.FC<{ data?: TDBResponse }> = ({ data }) => {
  const { data: session, status } = useSession();
  const { push } = useRouter();
  useEffect(() => {
    if (!!session === false) {
      push("/login");
    }
  }, [push, session]);
  return (
    <Skeleton active loading={status === "loading"} paragraph={{ rows: 24 }}>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 my-5">
        <div className="col-span-2 flex flex-col gap-6">
          <UserInfoDBCard
            {...{
              userName: session?.user?.name,
              isKeyInitialized: data?.data.userInfo.isKeyInitialized,
              email: data?.data.userInfo.phone,
              phone: data?.data.userInfo.email,
              publicKey: data?.data.userInfo.address,
              accountBalance: data?.data.userInfo.accountBalance,
            }}
          />
          <MyOwnedCollectionsCard data={data?.data.ownedCollections.data} />
        </div>
        <div className="col-span-1 flex flex-col gap-4">
          <div className="flex gap-4 justify-stretch">
            <ProtocolFeeCard
              title={`${data?.data.fees.protocolFeePercentage}%`}
              text="Protocol Fee"
            />
            <ProtocolFeeCard
              title={`${data?.data.fees.subjectFeePercentage}%`}
              text="Subject Fee"
            />
          </div>
          <MyRecentHistoryCard
            title="My Recent Trade History"
            total={data?.data.recentTradeHistory.total}
            handleViewMore={() => push("/history")}
            data={data?.data.recentTradeHistory.data.map((item) => ({
              title: `${item.sequence_number}`,
              features: [
                {
                  name: "Subject",
                  value: item.data.subject,
                },
                {
                  name: "New Supply",
                  value: item.data.new_supply,
                },
                {
                  name: `${item.data.is_buy ? "Bought" : "Sold"}`,
                  value: item.data.key_amount,
                },
              ],
            }))}
          />
        </div>
      </div>
    </Skeleton>
  );
};

export default DBContainer;
