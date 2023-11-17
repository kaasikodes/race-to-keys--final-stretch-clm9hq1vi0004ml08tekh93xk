"use client";
import React, { useState } from "react";
import Button from "../../ui/button";
import BuyOrSellKeys from "./BuyOrSellKeys";
import { useBuyKeys } from "@/app/hooks/keys/useBuyKeys";
import { openNotification } from "@/lib/utils/notifications";
import { useQueryClient } from "react-query";
import { QUERY_KEY_FOR_KEY_SUBJECT_DETAILS } from "@/app/hooks/keys/useGetKeySubjectDetails";

const BuyKeyBtn: React.FC<{
  keySubjectAddress: string;
  disabled?: boolean;
}> = ({ keySubjectAddress, disabled }) => {
  const [view, setView] = useState(false);
  const queryClient = useQueryClient();

  const { mutate, isLoading } = useBuyKeys();
  const handleClose = () => setView(false);
  const handleSubmit = (data: { amount: number }) => {
    mutate(
      {
        keySubjectAddress,
        body: {
          amount: data.amount,
        },
      },
      {
        onError: (err) => {
          openNotification({
            state: "error",
            title: "Error Occurred",
            description:
              "An error occurred while trying to buy keys. Please try again.",
          });
        },
        onSuccess: (res: any) => {
          openNotification({
            state: "success",

            title: "Success",
            description: res.data.message,
            // duration: 0.4,
          });

          queryClient.invalidateQueries({
            queryKey: [QUERY_KEY_FOR_KEY_SUBJECT_DETAILS],
            // exact: true,
          });
          handleClose();
        },
      }
    );
  };

  return (
    <>
      <BuyOrSellKeys
        onClose={handleClose}
        open={view}
        keySubjectAddress={keySubjectAddress}
        transactionType={"buy"}
        onConfirm={{ fn: (amount) => handleSubmit({ amount }), isLoading }}
      />
      <Button
        type="primary"
        className="bg-blue-500"
        size="small"
        onClick={() => setView(true)}
        disabled={disabled}
      >
        Buy
      </Button>
    </>
  );
};

export default BuyKeyBtn;
