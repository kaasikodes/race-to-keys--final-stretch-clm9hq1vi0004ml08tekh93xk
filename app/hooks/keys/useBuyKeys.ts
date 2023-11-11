import axios from "axios";
import { useMutation } from "react-query";

type TData = {
  body: {
    amount: number;
  };
  keySubjectAddress: string;
};
const createData = async (props: { data: TData }) => {
  const url = `/api/keys/key-subject/${props.data.keySubjectAddress}/buy`;

  const config = {
    headers: {
      Accept: "application/json",
    },
  };

  const data = props.data.body;
  const response = await axios.post(url, data, config);
  return response;
};
export const useBuyKeys = () => {
  return useMutation((props: TData) => createData({ data: props }));
};
