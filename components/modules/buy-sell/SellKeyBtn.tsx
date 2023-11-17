import React, { useState } from "react";
import Button from "../../ui/button";
import BuyOrSellKeys from "./BuyOrSellKeys";
import { useQueryClient } from "react-query";
import { useSellKeys } from "@/app/hooks/keys/useSellKeys";
import { QUERY_KEY_FOR_KEY_SUBJECT_DETAILS } from "@/app/hooks/keys/useGetKeySubjectDetails";
import { openNotification } from "@/lib/utils/notifications";

const SellKeyBtn: React.FC<{ keySubjectAddress: string }> = ({
  keySubjectAddress,
}) => {
  const [view, setView] = useState(false);
  const queryClient = useQueryClient();

  const { mutate, isLoading } = useSellKeys();
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
              "An error occurred while trying to sell keys. Please try again.",
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
        transactionType={"sell"}
        onConfirm={{ fn: (amount) => handleSubmit({ amount }), isLoading }}
      />
      <Button size="small" onClick={() => setView(true)}>
        Sell
      </Button>
    </>
  );
};

export default SellKeyBtn;
