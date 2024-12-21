import React from "react";

type Props = {
  text: string;
  className?: string;
  total: number;
};

function TotalShown({ text = "کۆی گشتی", className, total }: Props) {
  return (
    <div className="bg-soft_primary rounded-xl py-1 px-4 text-white flex flex-col items-center ">
      <span className="text-xs">{text}</span>
      <div className="flex gap-1 text-xs">
        <span>IQD</span>
        {Number(total).toLocaleString()}
      </div>{" "}
    </div>
  );
}

export default TotalShown;
