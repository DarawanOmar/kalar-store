import React from "react";
import { getHistoryMainCash, getHistorySubCash } from "../expenses/_action";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { DataTable } from "@/components/reuseable/table";
import column from "./_components/column";

type Props = {
  searchParams: searchParamsType;
};

async function HistoryTransaction({ searchParams }: Props) {
  const type = (await searchParams).type;
  console.log("Type => ", type);
  let data;
  if (type === "main-cash") {
    data = await getHistoryMainCash();
    console.log("Main Run");
  } else {
    data = await getHistorySubCash();
    console.log("Sub Run");
  }

  return (
    <div className="w-full">
      <div className="flex justify-between items-center w-full  my-10">
        <Link
          href={`/`}
          className="p-1 rounded-full text-soft_primary hover:bg-primary hover:text-white cursor-pointer transition-all duration-500  max-w-max me-auto"
        >
          <ChevronRight size={25} strokeWidth={2.5} />
        </Link>
      </div>
      <div className="my-10">
        <DataTable
          isSearch={false}
          data={data.data || []}
          columns={column}
          havePagination={false}
        />
      </div>
    </div>
  );
}

export default HistoryTransaction;
