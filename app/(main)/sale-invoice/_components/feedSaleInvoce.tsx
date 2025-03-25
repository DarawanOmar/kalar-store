import React from "react";
import CardSale from "./card-sale";
import { getAllCompleteSaleInvoice } from "../_lib";
import EmptyImage from "@/components/reuseable/empty-image";
import { parseDateRange } from "@/lib/utils";
import PaginatedComponent from "@/components/ui/pagination";

async function FeedSaleInvoice({
  searchParams,
}: {
  searchParams: searchParamsType;
}) {
  const page = Number((await searchParams).page) || 1;
  const range = ((await searchParams).range as string) || "";
  const { startDate, endDate } = parseDateRange(range);

  const allSaleInvoice = await getAllCompleteSaleInvoice(
    startDate,
    endDate,
    page
  );
  if (allSaleInvoice?.data?.data?.length === 0) {
    return <EmptyImage />;
  }
  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-10">
        {allSaleInvoice?.data?.data?.map((product, index) => (
          <CardSale key={index} product={product} />
        ))}
      </div>
      <div className="my-5">
        <PaginatedComponent
          currentPage={page}
          totalPages={allSaleInvoice?.data?.totalPage || 1}
        />
      </div>
    </>
  );
}
export default FeedSaleInvoice;
