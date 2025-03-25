import { DataTable } from "@/components/reuseable/table";
import { ChevronLeft } from "lucide-react";
import React from "react";
import column from "../_components/columns";
import Link from "next/link";
import { getOneSaleInvoice } from "../_lib";
import TotalShown from "@/components/reuseable/total-shown";
import { format } from "date-fns";
import EmptyImage from "@/components/reuseable/empty-image";

type Props = {
  params: Promise<{
    id: string;
  }>;
};

async function OneSaleInvoice({ params }: Props) {
  const id = (await params).id;
  const OneSaleInvoice = await getOneSaleInvoice(Number(id));
  if (OneSaleInvoice.message === "Invoice not found") {
    return <EmptyImage />;
  }
  return (
    <div className="my-10">
      <div className="flex justify-between sm:items-center ">
        <div className="flex flex-wrap gap-3 sm:items-center">
          <TotalShown text="ناو" total={OneSaleInvoice.data?.name || ""} />
          <TotalShown
            text="جۆری پسوڵە"
            total={OneSaleInvoice.data?.type === "cash" ? "کاش" : "قەرز"}
          />
          <TotalShown text="تێبینی" total={OneSaleInvoice.data?.note || ""} />
          <TotalShown
            text="بەروار"
            total={format(OneSaleInvoice?.data?.createdAt || "", "P") || ""}
          />
          <TotalShown text="شوێن" total={OneSaleInvoice.data?.place || ""} />
          <TotalShown
            text="ژ.مۆبایل"
            total={OneSaleInvoice.data?.phone || ""}
          />
          {OneSaleInvoice.data?.discount ? (
            <TotalShown
              text="داشکاندن"
              total={OneSaleInvoice.data?.discount || 0}
            />
          ) : null}
          <TotalShown text="کۆی گشتی" total={OneSaleInvoice.data?.total || 0} />
        </div>
        <Link
          href={`/sale-invoice`}
          className="p-1 rounded-full text-soft_primary hover:bg-primary hover:text-white cursor-pointer transition-all duration-500  max-w-max mr-auto"
        >
          <ChevronLeft />{" "}
        </Link>
      </div>

      <div className="my-10">
        <DataTable
          data={OneSaleInvoice.data?.products || []}
          columns={column}
          isSearch={false}
        />
      </div>
    </div>
  );
}

export default OneSaleInvoice;
