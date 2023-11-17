import axios from "axios";
import { useMutation } from "react-query";

type TData = {
  body: {
    amount: number;
    address: string;
  };
};
const createData = async (props: { data: TData }) => {
  const url = `/api/user/account/transfer`;

  const config = {
    headers: {
      Accept: "application/json",
    },
  };

  const data = props.data.body;
  const response = await axios.post(url, data, config);
  return response;
};
export const useTransferAptosTo = () => {
  return useMutation((props: TData) => createData({ data: props }));
};
