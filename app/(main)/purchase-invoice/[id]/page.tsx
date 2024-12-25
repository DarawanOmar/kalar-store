import { DataTable } from "@/components/reuseable/table";
import { ChevronLeft } from "lucide-react";
import React from "react";
import column from "../_components/columns";
import Link from "next/link";
import { getOnePurchaseInvoice } from "../_lib";
import TotalShown from "@/components/reuseable/total-shown";
import { format } from "date-fns";

type Props = {
  params: {
    id: string;
  };
  searchParams: searchParamsType;
};

async function OneSaleInvoice({ params, searchParams }: Props) {
  const id = (await params).id;
  const oneInvoice = await getOnePurchaseInvoice(Number(id));
  if (oneInvoice.data)
    return (
      <div className="my-10">
        <div className="flex justify-between sm:items-center ">
          <div className="flex flex-wrap gap-3 sm:items-center">
            <TotalShown text="ناو" total={oneInvoice.data?.name || ""} />
            <TotalShown text="تێبینی" total={oneInvoice.data?.note || ""} />
            <TotalShown
              text="بەروار"
              total={format(oneInvoice?.data?.createdAt, "P") || ""}
            />
            <TotalShown text="شوێن" total={oneInvoice.data?.place || ""} />
            <TotalShown text="کۆی گشتی" total={oneInvoice.data?.total || 0} />
          </div>
          <Link
            href={`/purchase-invoice`}
            className="p-1 rounded-full text-soft_primary hover:bg-primary hover:text-white cursor-pointer transition-all duration-500  max-w-max mr-auto"
          >
            <ChevronLeft />{" "}
          </Link>
        </div>
        <div className="my-10">
          <DataTable
            data={oneInvoice.data?.products || []}
            columns={column}
            isSearch={false}
          />
        </div>
      </div>
    );
}

export default OneSaleInvoice;
