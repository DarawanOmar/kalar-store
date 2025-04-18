import React from "react";
import { getOneLoanDetails } from "../_actions";
import column from "./_components/columns";
import { DataTable } from "@/components/reuseable/table";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import TotalShown from "@/components/reuseable/total-shown";

type Props = {
  params: Promise<{
    id: string;
  }>;
};
async function OneLoan({ params }: Props) {
  const id = Number((await params).id) || 0;
  const oneLoanDetails = await getOneLoanDetails(id);
  return (
    <div className="w-full">
      <div className="flex justify-between items-center w-full  my-10">
        <Link
          href={`/loans`}
          className="p-1 rounded-full text-soft_primary hover:bg-primary hover:text-white cursor-pointer transition-all duration-500  max-w-max "
        >
          <ChevronRight size={25} strokeWidth={2.5} />
        </Link>
        <div className="grid grid-cols-2 gap-5">
          <TotalShown
            text="ماوە"
            total={
              oneLoanDetails.data?.[0]?.Sale_invoice?.remaining_amount || 0
            }
          />
          <TotalShown
            text="کۆی گشتی"
            total={oneLoanDetails.data?.[0]?.Sale_invoice?.total_amount || 0}
          />
        </div>
      </div>
      <div className="my-10">
        <DataTable
          isSearch={false}
          data={oneLoanDetails.data || []}
          columns={column}
          havePagination={false}
        />
      </div>
    </div>
  );
}

export default OneLoan;
