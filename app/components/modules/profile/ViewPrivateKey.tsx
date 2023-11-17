import { IModalProps } from "@/lib/types";
import React, { useState } from "react";
import Modal from "../../ui/modal";
import Skeleton from "../../ui/skeleton";
import Button from "../../ui/button";
import { useQueryClient } from "react-query";
import { useAuthUserPrivateKey } from "@/app/hooks/account/useAuthUserPrivateKey";
import { Typography } from "antd";
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";

type TAction = "show" | "hide";
type IProps = {
  title: string;
};

const ViewPrivateKey: React.FC<Partial<IProps> & IModalProps> = ({
  open,
  onClose,
  title = "View Private Key",
}) => {
  const [action, setAction] = useState<TAction>("hide");
  const { data, isLoading } = useAuthUserPrivateKey();

  return (
    <Modal
      open={open}
      onCancel={onClose}
      footer={null}
      title={<span className="capitalize">{`${title}`}</span>}
      style={{ top: 10 }}
    >
      <Skeleton loading={isLoading} active paragraph={{ rows: 5 }}>
        <div className="min-h-[200px] flex justify-center gap-4 flex-col">
          <Button
            icon={action === "hide" ? <AiFillEyeInvisible /> : <AiFillEye />}
            onClick={() => setAction(action === "hide" ? "show" : "hide")}
          >
            {action === "hide" ? "Show" : "Hide"}
          </Button>
          {action === "show" && (
            <Typography.Title level={4}>
              {data?.data?.privateKey}
            </Typography.Title>
          )}
        </div>
      </Skeleton>
    </Modal>
  );
};

export default ViewPrivateKey;
