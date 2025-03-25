import { DatePickerWithRange } from "@/components/layout/date-picker-with-range";
import SkelotonCard from "@/components/reuseable/skeloton-card";
import Title from "@/components/reuseable/title";
import { SquarePercent } from "lucide-react";
import React, { Suspense } from "react";
import FeedSaleInvoice from "./_components/feedSaleInvoce";

function SaleInvoice({ searchParams }: { searchParams: searchParamsType }) {
  return (
    <div className="my-10">
      <div className="flex flex-col sm:flex-row gap-3 justify-between items-center">
        <Title text="پسووڵەی فرۆشراو" icon={<SquarePercent />} />
        <DatePickerWithRange />
      </div>
      <div className="my-10">
        <Suspense
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
