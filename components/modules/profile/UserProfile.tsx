import { IModalProps } from "@/lib/types";
import React, { useEffect } from "react";
import Modal from "../../ui/modal";
import Avatar from "../../ui/avatar";
import Form from "../../ui/form";
import Skeleton from "../../ui/skeleton";
import Input from "../../ui/input";
import Button from "../../ui/button";
import { useGetUserData } from "@/app/hooks/account/useGetUserData";
import { useUpdateUserData } from "@/app/hooks/account/useUpdateUserData";
import { openNotification } from "@/lib/utils/notifications";
import { useQueryClient } from "react-query";
import { QUERY_KEY_FOR_AUTH_USER_PRIVATE_KEY } from "@/app/hooks/account/useAuthUserPrivateKey";

type IProps = {
  title: string;
  userId: string;
  disabled: boolean;
};
type FormInputProps = Partial<{
  username: string | null;
  email: string | null;
  address: string | null;
  phone: string | null;
}>;
const UserProfile: React.FC<Partial<IProps> & IModalProps> = ({
  open,
  onClose,
  title = "My Profile",
  userId,
  disabled,
}) => {
  const queryClient = useQueryClient();

  const [form] = Form.useForm<FormInputProps>();
  const { data, isLoading, isSuccess } = useGetUserData({ userId });
  useEffect(() => {
    if (isSuccess && data) {
      form.setFieldsValue({
        address: data?.data?.address,
        email: data?.data?.email,
        phone: data?.data?.phone,
        username: data?.data?.userName,
      });
    }
  }, [isSuccess, data, form]);

  //   TODO: Refactor this to a prop
  const { mutate, isLoading: isUpdating } = useUpdateUserData();
  const handleSubmit = (data: FormInputProps) => {
    if (!userId) return;
    mutate(
      {
        body: {
          email: data.email,
          phone: data.phone,
        },
        userId,
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
      <Skeleton loading={isLoading} paragraph={{ rows: 10 }}>
        <Form
          labelCol={{ span: 24 }}
          requiredMark={false}
          form={form}
          disabled={disabled}
          onFinish={handleSubmit}
        >
          <div className="flex justify-center mb-4">
            <Avatar src={data?.data.imageSrc} size={`large`} />
          </div>
          <Form.Item name={`username`} label="Username">
            <Input disabled />
            {/* User should not be able to edit username, should be simply from twitter 4 time being */}
          </Form.Item>
          <Form.Item name={`address`} label="Address">
            <Input.TextArea disabled />
          </Form.Item>
          <Form.Item name={`email`} label="Email">
            <Input />
          </Form.Item>
          <Form.Item name={`phone`} label="Phone">
            <Input />
          </Form.Item>

          {disabled ? null : (
            <div className="flex justify-end">
              <Button loading={isUpdating} htmlType="submit">
                Save
              </Button>
            </div>
          )}
        </Form>
      </Skeleton>
    </Modal>
  );
};

export default UserProfile;
