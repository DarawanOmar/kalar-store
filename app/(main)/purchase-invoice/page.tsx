import { DatePickerWithRange } from "@/components/layout/date-picker-with-range";
import SkelotonCard from "@/components/reuseable/skeloton-card";
import Title from "@/components/reuseable/title";
import { SquarePercent } from "lucide-react";
import React, { Suspense } from "react";
import PaginatedComponent from "@/components/ui/pagination";
import FeedPurchaseInvoice from "./_components/feedPurchaseInvoce";
// import { getAllCompleteInvoice } from "./_lib";

async function PurchaseInvoice() {
  // console.dir(allPurchaseInvoice, { depth: null });
  return (
    <div className="my-10">
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-center">
        <Title text="پسووڵەی کڕدراو" icon={<SquarePercent />} />
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
          <FeedPurchaseInvoice />
        </Suspense>
      </div>
      <div className="">
        <PaginatedComponent currentPage={1} totalPages={1} />
      </div>
    </div>
  );
}

export default PurchaseInvoice;
