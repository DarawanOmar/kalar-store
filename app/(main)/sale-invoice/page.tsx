import { DatePickerWithRange } from "@/components/layout/date-picker-with-range";
import SkelotonCard from "@/components/reuseable/skeloton-card";
import Title from "@/components/reuseable/title";
import { SquarePercent } from "lucide-react";
import React, { Suspense } from "react";
import { parseDateRange } from "@/lib/utils";
import { getAllCompleteSaleInvoice } from "./_lib";
import EmptyImage from "@/components/reuseable/empty-image";
import TotalShown from "@/components/reuseable/total-shown";
import CardSale from "./_components/card-sale";
import PaginatedComponent from "@/components/ui/pagination";
import { Metadata } from "next";
import SelectType from "./_components/select-type";

export const metadata: Metadata = {
  title: "Sale Invoice",
};
async function SaleInvoice({
  searchParams,
}: {
  searchParams: searchParamsType;
}) {
  const page = Number((await searchParams).page) || 1;
  const range = ((await searchParams).range as string) || "";
  const type = ((await searchParams).type as "loan" | "cash") || "loan";
  return (
    <div className="my-10">
      <div className="my-10">
        <Suspense
          key={page + range + type}
          fallback={
            <SkelotonCard
              height="h-32 rounded-3xl"
              className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-10"
            />
          }
        >
          <FeedSaleInvoice searchParams={searchParams} />
        </Suspense>
      </div>
    </div>
  );
}

export default SaleInvoice;

async function FeedSaleInvoice({
  searchParams,
}: {
  searchParams: searchParamsType;
}) {
  const page = Number((await searchParams).page) || 1;
  const range = ((await searchParams).range as string) || "";
  const type = ((await searchParams).type as "loan" | "cash") || "";
  const { startDate, endDate } = parseDateRange(range);

  const allSaleInvoice = await getAllCompleteSaleInvoice(
    startDate,
    endDate,
    type,
    page
  );

  return (
    <>
      <div className="flex flex-col sm:flex-row gap-3 justify-between items-center mb-10">
        <Title text="پسووڵەی فرۆشراو" icon={<SquarePercent />} />
        <div className="flex flex-col sm:flex-row gap-3 items-center">
          <SelectType />
          <TotalShown
            text="کۆی گشتی "
            total={allSaleInvoice?.data?.total || 0}
            className="max-w-max mx-auto"
          />
          <DatePickerWithRange />
        </div>
      </div>

      {allSaleInvoice.data?.data.length === 0 ? (
        <EmptyImage />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-10">
          {allSaleInvoice?.data?.data?.map((product, index) => (
            <CardSale key={index} product={product} />
          ))}
        </div>
      )}
      <div className="my-5">
        <PaginatedComponent
          currentPage={page}
          totalPages={allSaleInvoice?.data?.totalPage || 1}
        />
      </div>
    </>
  );
}
