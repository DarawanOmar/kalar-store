import { DatePickerWithRange } from "@/components/layout/date-picker-with-range";
import SkelotonCard from "@/components/reuseable/skeloton-card";
import Title from "@/components/reuseable/title";
import { SquarePercent } from "lucide-react";
import React, { Suspense } from "react";
import PaginatedComponent from "@/components/ui/pagination";
import FeedPurchaseInvoice from "./_components/feedPurchaseInvoce";

function PurchaseInvoice() {
  return (
    <div className="my-10">
      <div className="flex justify-between items-center">
        <Title text="پسووڵەی کڕدراو" icon={<SquarePercent />} />
        <DatePickerWithRange />
      </div>
      <div className="my-10">
        <Suspense
          fallback={
            <SkelotonCard
              height="h-40 rounded-3xl"
              className="grid-cols-1 sm:grid-cols-2 xl:grid-cols-3"
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
