import React from "react";

const ProtocolFeeCard: React.FC<{ title?: string; text?: string }> = ({
  title,
  text,
}) => {
  return (
    <div className="text-black border rounded-lg text-sm shadow px-5 pt-4 pb-6 flex-1">
      <span className="text-blackfont-semibold text-lg text-blue-500">
        {title}
      </span>
      <h6 className="text-xs font-semibold">{text}</h6>
    </div>
  );
};

export default ProtocolFeeCard;
