import { DataTable } from "@/components/reuseable/table";
import { ArrowLeft, ChevronLeft } from "lucide-react";
import React from "react";
import column from "../_components/columns";
import Link from "next/link";

function OneSaleInvoice() {
  return (
    <div className="my-10">
      <div className="flex justify-between items-center">
        <div className="flex flex-col rounded-lg py-1 px-4 bg-primary text-white">
          <span className="text-xs text-center">کۆی گشتی</span>
          <span dir="ltr" className="text-xs">
            {Number(150000).toLocaleString()} IQD
          </span>
        </div>
        <Link
          href={`/sale-invoice`}
          className="p-1 rounded-full text-soft_primary hover:bg-primary hover:text-white cursor-pointer transition-all duration-500  max-w-max mr-auto"
        >
          <ChevronLeft />{" "}
        </Link>
      </div>
      <div className="my-10">
        <DataTable data={[]} columns={column} isSearch={false} />
      </div>
    </div>
  );
}

export default OneSaleInvoice;
