"use client";

import { TAuthUserPrivateKeyResponse } from "@/lib/types";
import axios from "axios";
import { useQuery } from "react-query";

export const QUERY_KEY_FOR_AUTH_USER_PRIVATE_KEY = "auth-user-private-key";

const getData = async (): Promise<TAuthUserPrivateKeyResponse> => {
  const url = `/api/user/account/private-key/`;
  const config = {
    headers: {
      Accept: "application/json",
    },
  };

  const response = await axios.get(url, config);
  return response.data as TAuthUserPrivateKeyResponse;
};
export const useAuthUserPrivateKey = () => {
  const queryData = useQuery(
    [QUERY_KEY_FOR_AUTH_USER_PRIVATE_KEY],
    () => getData(),
    {
      onError: (err: any) => {},
      onSuccess: (data) => {},
    }
  );

  return queryData;
};
