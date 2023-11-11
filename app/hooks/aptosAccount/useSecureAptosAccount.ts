import axios from "axios";

type TData = {
  accessCode: string;
  catchPhrases: string[];
};
const secureAptosAccount = async (props: { data: TData }) => {
  const url = `/api/user/account/secure-account`;
  const config = {
    headers: {
      Accept: "application/json",
    },
  };

  const data: TData = {
    ...props.data,
  };

  const response = await axios.post(url, data, config);
  return response;
};
export const useSecureAptosAccount = () => {
  return {
    secureAptosAccount,
  };
};
