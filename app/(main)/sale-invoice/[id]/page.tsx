import { DataTable } from "@/components/reuseable/table";
import { ChevronLeft } from "lucide-react";
import React, { cache, Suspense } from "react";
import column from "../_components/columns";
import Link from "next/link";
import { getOneSaleInvoice } from "../_lib";
import TotalShown from "@/components/reuseable/total-shown";
import { format } from "date-fns";
import { redirect } from "next/navigation";
import SkelotonCard from "@/components/reuseable/skeloton-card";

type Props = {
  params: Promise<{
    id: string;
  }>;
};
import { Metadata } from "next";

const getDataOneSaleCache = cache(async (id: number) => {
  return await getOneSaleInvoice(id);
});

export const generateMetadata = async ({
  params,
}: Props): Promise<Metadata> => {
  const id = (await params).id;
  const OneSaleInvoice = await getDataOneSaleCache(Number(id));
  return {
    title: OneSaleInvoice.data?.name || "Sale Invoice",
    description: `Details of sale invoice with ID ${id}`,
  };
};

function OneSaleInvoice({ params }: Props) {
  return (
    <Suspense
      fallback={
        <SkelotonCard
          height="h-32 rounded-3xl"
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-10"
        />
      }
    >
      <FeedPage params={params} />
    </Suspense>
  );
}

export default OneSaleInvoice;

async function FeedPage({ params }: Props) {
  const id = (await params).id;
  const OneSaleInvoice = await getDataOneSaleCache(Number(id));
  if (OneSaleInvoice.message === "Invoice not found") {
    redirect("/sale-invoice");
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
