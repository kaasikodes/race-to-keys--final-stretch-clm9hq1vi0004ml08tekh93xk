"use client";

import { TGetUserDataResponse } from "@/lib/types";
import axios from "axios";
import { useQuery } from "react-query";

export const QUERY_KEY_FOR_SINGLE_USER_DATA = "single-user-data";

type TData = {
  userId?: string;
};

const getData = async ({ userId }: TData): Promise<TGetUserDataResponse> => {
  const url = `/api/user/account/profile/${userId}`;
  const config = {
    headers: {
      Accept: "application/json",
    },
  };

  const response = await axios.get(url, config);
  return response.data as TGetUserDataResponse;
};
export const useGetUserData = (props: TData) => {
  const { userId } = props;
  const queryData = useQuery(
    [QUERY_KEY_FOR_SINGLE_USER_DATA, userId],
    () => getData({ userId }),
    {
      enabled: userId !== undefined,
      onError: (err: any) => {},
      onSuccess: (data) => {},
    }
  );

  return queryData;
};
