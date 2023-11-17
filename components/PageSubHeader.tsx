"use client";
interface IProps {
  description: string | { content: string; className: string };
  hideBackground?: boolean;
}

const PageSubHeader = ({ description, hideBackground = false }: IProps) => {
  return (
    <div
      className={`flex flex-col mt-5 gap-2 md:flex-row md:justify-between md:items-center  p-2 rounded text-sm ${
        hideBackground === false ? "bg-card" : ""
      }`}
    >
      {typeof description === "string" && <p>{description}</p>}
      {typeof description === "object" && (
        <p className={description.className}>{description.content}</p>
      )}
    </div>
  );
};

export default PageSubHeader;
