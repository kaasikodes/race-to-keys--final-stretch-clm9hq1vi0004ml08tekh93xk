"use client";

import Skeleton from "./ui/skeleton";

type introProps = {
  title?: string;
  link?: string;
  close?: () => void;
  loading?: boolean;
  // close?: (event: React.MouseEvent<HTMLButtonElement>) => void
};
const PageHeader = ({ title, link, close, loading }: introProps) => {
  return (
    <Skeleton loading={loading} active paragraph={{ rows: 2 }}>
      <div className="flex items-center gap-3 font-extrabold ">
        {close && (
          <i
            onClick={close}
            className="ri-arrow-left-s-line text-lg cursor-pointer hover:text-caramel"
          ></i>
        )}
        <h2 className="text-xl text-black capitalize">{title}</h2>
      </div>
    </Skeleton>
  );
};

export default PageHeader;
