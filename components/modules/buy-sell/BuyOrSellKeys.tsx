"use client";
import Form from "../../ui/form";
import InputNumber from "../../ui/input-number";
import Modal from "../../ui/modal";
import Button from "../../ui/button";
import Skeleton from "../../ui/skeleton";
import { useGetKeySubjectDetails } from "@/app/hooks/keys/useGetKeySubjectDetails";
import ProtocolFeeCard from "../dashboard/ProtocolFeeCard";
import { useEffect, useState } from "react";
import { IModalProps } from "@/lib/types";

type IProps = {
  keySubjectAddress: string;
  onConfirm?: {
    fn: (amount: number) => void;
    isLoading?: boolean;
  };
  transactionType?: "buy" | "sell";
};
const BuyOrSellKeys: React.FC<Partial<IProps> & IModalProps> = ({
  onClose,
  open,
  keySubjectAddress,
  transactionType = "buy",
  onConfirm,
}) => {
  const { data, isFetching } = useGetKeySubjectDetails({
    keySubjectAddress,
  });
  const [action, setAction] = useState<"enter-amount" | "confirm-details">(
    "enter-amount"
  );
  const [form] = Form.useForm<{ amount: number }>();
  const [amount, setAmount] = useState<number>(0);
  const handleCancel = () => {
    setAction("enter-amount");
    form.resetFields();
    onClose();
  };

  if (!keySubjectAddress) return null;
  return (
    <Modal
      open={open}
      onCancel={handleCancel}
      footer={null}
      title={<span className="capitalize">{`${transactionType} keys`}</span>}
    >
      <Skeleton active paragraph={{ rows: 4 }} loading={isFetching}>
        <>
          {action === "enter-amount" && (
            <div className="flex flex-col gap-4">
              <div className="grid grid-cols-2 gap-4">
                <ProtocolFeeCard
                  title={`${data?.data.keySupply}`}
                  text={`Key Supply`}
                />
                <ProtocolFeeCard
                  title={`${data?.data.userKeyBalance}`}
                  text={`Owner Balance`}
                />
              </div>
              <Form
                form={form}
                labelCol={{ span: 24 }}
                requiredMark={false}
                onFinish={(data) => {
                  setAmount(data.amount);
                  setAction("confirm-details");
                }}
              >
                <Form.Item
                  label="Amount"
                  name="amount"
                  rules={[
                    {
                      required: true,
                      validator: (_, value) => {
                        if (typeof value !== "number") {
                          return Promise.reject("Please enter a valid digit!");
                        }
                        if (value <= 0) {
                          return Promise.reject(
                            "Amount must be greater than 0"
                          );
                        }
                        // if (
                        //   data?.data.keySupply &&
                        //   value > data?.data.keySupply
                        // ) {
                        //   return Promise.reject(
                        //     "Amount must be less than or equal to total supply"
                        //   );
                        // }
                        //   value should be whole number
                        if (value % 1 !== 0) {
                          return Promise.reject(
                            "Amount must be a whole number"
                          );
                        }
                        return Promise.resolve();
                      },
                    },
                  ]}
                >
                  <InputNumber
                    className="w-full"
                    placeholder="Enter Amount of Keys"
                  />
                </Form.Item>
                <div className="flex justify-end">
                  <Button htmlType="submit">{`Next`}</Button>
                </div>
              </Form>
            </div>
          )}
          {action === "confirm-details" && (
            <ConfirmDetails
              {...{
                keySubjectAddress,
                onConfirm,
                amount,
                transactionType,
                onCancel: () => setAction("enter-amount"),
              }}
            />
          )}
        </>
      </Skeleton>
    </Modal>
  );
};
const ConfirmDetails: React.FC<
  IProps & { amount: number; onCancel: () => void }
> = (props) => {
  const { data, isFetching } = useGetKeySubjectDetails({
    keySubjectAddress: props.keySubjectAddress,
    buyAmount: props.amount,
    sellAmount: props.amount,
  });
  return (
    <Skeleton loading={isFetching} active paragraph={{ rows: 8 }}>
      <div className="flex flex-col gap-4">
        <div className="grid grid-cols-2 gap-4">
          {props.transactionType === "buy" && (
            <>
              {" "}
              <ProtocolFeeCard
                title={`${data?.data.price.buyPrice}`}
                text="Buy Price"
              />
              <ProtocolFeeCard
                title={`${data?.data.price.buyPriceAfterFees}`}
                text="Buy Price After Fees"
              />
            </>
          )}
          {props.transactionType === "sell" && (
            <>
              <ProtocolFeeCard
                title={`${data?.data.price.sellPrice}`}
                text="Sell Price"
              />
              <ProtocolFeeCard
                title={`${data?.data.price.sellPriceAfterFees}`}
                text="Sell Price After Fees"
              />
            </>
          )}
          <ProtocolFeeCard
            title={`${data?.data.keyHolders.total}`}
            text="Total Holders"
          />
          <ProtocolFeeCard
            title={`${data?.data.keySupply}`}
            text="Total Supply"
          />
          <ProtocolFeeCard
            title={`${data?.data.userKeyBalance}`}
            text="Owner Balance"
          />
          {props.transactionType === "buy" && (
            <ProtocolFeeCard
              title={`${props.amount}`}
              text="Amount to be Bought"
            />
          )}
          {props.transactionType === "sell" && (
            <ProtocolFeeCard
              title={`${props.amount}`}
              text="Amount to be Sold"
            />
          )}
        </div>
        <div className="flex gap-4 justify-end">
          <Button onClick={() => props.onCancel()} type={`text`}>
            Back
          </Button>
          <Button
            loading={props.onConfirm?.isLoading}
            onClick={() => props.onConfirm?.fn(props.amount)}
          >
            Confirm{" "}
          </Button>
        </div>
      </div>
    </Skeleton>
  );
};

export default BuyOrSellKeys;
