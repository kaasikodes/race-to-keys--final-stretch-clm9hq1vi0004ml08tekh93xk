import axios from "axios";
import { useMutation } from "react-query";

type TData = {
  body: {
    email?: string | null;
    phone?: string | null;
  };
  userId: string;
};
const createData = async (props: { data: TData }) => {
  const url = `/api/user/account/profile/${props.data.userId}/save`;

  const config = {
    headers: {
      Accept: "application/json",
    },
  };

  const data = props.data.body;
  const response = await axios.post(url, data, config);
  return response;
};
export const useUpdateUserData = () => {
  return useMutation((props: TData) => createData({ data: props }));
};
