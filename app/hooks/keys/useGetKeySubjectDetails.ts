"use client";

import { TKeySubjectDetailsResponse } from "@/lib/types";
import axios from "axios";
import { useQuery } from "react-query";

export const QUERY_KEY_FOR_KEY_SUBJECT_DETAILS = "key-subject-details";
type TData = {
  keySubjectAddress?: string;
  buyAmount?: number;
  sellAmount?: number;
};
const getData = async (props: {
  data: TData;
}): Promise<TKeySubjectDetailsResponse> => {
  const url = `/api/keys/key-subject/${props.data.keySubjectAddress}`;
  const config = {
    headers: {
      Accept: "application/json",
    },
    params: {
      buyAmount: props.data.buyAmount,
      sellAmount: props.data.sellAmount,
    },
  };

  const response = await axios.get(url, config);
  return response.data as TKeySubjectDetailsResponse;
};
export const useGetKeySubjectDetails = (props: TData) => {
  const queryData = useQuery(
    [QUERY_KEY_FOR_KEY_SUBJECT_DETAILS, props],
    () =>
      getData({
        data: {
          ...props,
        },
      }),
    {
      enabled: props.keySubjectAddress !== undefined,
      onError: (err: any) => {},
      onSuccess: (data) => {},
    }
  );

  return queryData;
};
