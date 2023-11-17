import { IModalProps } from "@/lib/types";
import React, { useEffect } from "react";
import Modal from "../../ui/modal";
import Form from "../../ui/form";
import Input from "../../ui/input";
import InputNumber from "../../ui/input-number";
import Button from "../../ui/button";
import { openNotification } from "@/lib/utils/notifications";
import { useQueryClient } from "react-query";
import { QUERY_KEY_FOR_AUTH_USER_PRIVATE_KEY } from "@/app/hooks/account/useAuthUserPrivateKey";
import { useTransferAptosTo } from "@/app/hooks/account/transfer/useTransferAptosTo";

type IProps = {
  title: string;
};
type FormInputProps = {
  amount: number;
  address: string;
};
const TransferAptos: React.FC<Partial<IProps> & IModalProps> = ({
  open,
  onClose,
  title = "Transfer Aptos",
}) => {
  const queryClient = useQueryClient();

  const [form] = Form.useForm<FormInputProps>();

  //   TODO: Refactor this to a prop
  const { mutate, isLoading: isTranferring } = useTransferAptosTo();
  const handleSubmit = (data: FormInputProps) => {
    mutate(
      {
        body: {
          address: data.address,
          amount: data.amount,
        },
      },
      {
        onError: (err) => {
          openNotification({
            state: "error",
            title: "Error Occurred",
            description:
              "An error occurred while trying update data. Please try again.",
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
            queryKey: [QUERY_KEY_FOR_AUTH_USER_PRIVATE_KEY],
            // exact: true,
          });
          onClose();
        },
      }
    );
  };
  return (
    <Modal
      open={open}
      onCancel={onClose}
      footer={null}
      title={<span className="capitalize">{`${title}`}</span>}
      style={{ top: 10 }}
    >
      <Form
        labelCol={{ span: 24 }}
        requiredMark={false}
        form={form}
        onFinish={handleSubmit}
      >
        <Form.Item name={`address`} label="Address">
          <Input />
        </Form.Item>
        <Form.Item
          name={`amount`}
          label="Amount"
          rules={[
            {
              required: true,
              validator: (_, value) => {
                if (typeof value !== "number") {
                  return Promise.reject("Please enter a valid digit!");
                }
                if (value <= 0) {
                  return Promise.reject("Amount must be greater than 0");
                }

                return Promise.resolve();
              },
            },
          ]}
        >
          <InputNumber />
        </Form.Item>

        <div className="flex justify-end">
          <Button loading={isTranferring} htmlType="submit">
            Send
          </Button>
        </div>
      </Form>
    </Modal>
  );
};

export default TransferAptos;
