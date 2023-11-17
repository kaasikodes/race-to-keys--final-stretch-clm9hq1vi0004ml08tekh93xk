import React from "react";
import Skeleton from "../../ui/skeleton";
import Dropdown from "../../ui/dropdown";
import Empty from "../../ui/empty";
import { AiOutlineMore } from "react-icons/ai";
import { truncateString } from "@/lib/utils";

export const requestStyle =
  "flex items-center justify-between cursor-pointer group border-b pb-2";

export const LIMIT_OF_ITEMS_TO_DISPLAY = 3;

interface IProps {
  emptyComp?: React.ReactNode;
  title: string;
  secondaryColTitle?: string;
  loading?: boolean;
  data?: {
    title: string;
    features?: { name?: string; value?: string | number; color?: string }[];
    secondaryCol?:
      | { type: "text"; text: string }
      | { type: "options"; options: { name: string; onClick: () => void }[] };
  }[];
  handleViewMore?: () => void;
  total?: number;
}

const MyRecentHistoryCard: React.FC<IProps> = ({
  title,
  secondaryColTitle,
  data,
  total,
  loading,
  handleViewMore,
  emptyComp = <Empty description="No Data" />,
}) => {
  return (
    <div className=" pb-6 border rounded-lg text-sm shadow">
      <div className="flex items-center justify-between px-3 py-3 border-b">
        <p className="font-medium">{title}</p>
        <span className="text-xs capitalize">{secondaryColTitle}</span>
      </div>
      <div className="flex flex-col gap-3 px-3 py-2">
        <Skeleton loading={loading} active paragraph={{ rows: 4 }}>
          {data && data.length > 0 ? (
            data.slice(0, LIMIT_OF_ITEMS_TO_DISPLAY).map((item, i) => (
              <div className={requestStyle} key={i}>
                <div className="flex flex-col gap-1">
                  <h5 className="font-medium capitalize">{item.title}</h5>
                  {item?.features?.map((item, i) => (
                    <span
                      className="text-xs capitalize"
                      key={i}
                      style={{ color: item.color }}
                    >
                      {item.name && `${item?.name}:`}{" "}
                      {truncateString(`${item.value}`, 40)}
                    </span>
                  ))}
                </div>
                {item.secondaryCol?.type === "options" && (
                  <Dropdown
                    getPopupContainer={(triggerNode) =>
                      triggerNode.parentElement as HTMLElement
                    }
                    className="overflow-hidden"
                    menu={{
                      items: item.secondaryCol.options.map((item) => ({
                        key: item.name,
                        label: item.name,
                        onClick: item.onClick,
                      })),
                    }}
                    trigger={["click"]}
                  >
                    <AiOutlineMore />
                  </Dropdown>
                )}
                {item.secondaryCol?.type === "text" && (
                  <span className="text-xs capitalize">
                    {item.secondaryCol.text}
                  </span>
                )}
              </div>
            ))
          ) : (
            <>{emptyComp}</>
          )}
        </Skeleton>
      </div>
      {total && total > LIMIT_OF_ITEMS_TO_DISPLAY ? (
        <h2
          onClick={() => handleViewMore?.()}
          className="text-caramel text-right px-3 text-sm font-semibold cursor-pointer hover:text-black pb-2 pt-1"
        >
          See All
        </h2>
      ) : null}
    </div>
  );
};

export default MyRecentHistoryCard;
