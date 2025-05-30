import React from "react";
import { getAllCompleteInvoice } from "../_lib";
import { CircleArrowRight, FileText } from "lucide-react";
import Link from "next/link";
import EmptyImage from "@/components/reuseable/empty-image";
import PaginatedComponent from "@/components/ui/pagination";
import { redirect } from "next/navigation";
import { format } from "date-fns";
import { parseDateRange } from "@/lib/utils";

async function FeedPurchaseInvoice({
  searchParams,
}: {
  searchParams: searchParamsType;
}) {
  const page = Number((await searchParams).page) || 1;
  const range = ((await searchParams).range as string) || "";
  const { startDate, endDate } = parseDateRange(range);

  const allPurchaseInvoice = await getAllCompleteInvoice(
    startDate,
    endDate,
    page
  );

  if (allPurchaseInvoice.data?.formattedInvoices.length === 0 && page === 1) {
    return <EmptyImage />;
  }
  if (allPurchaseInvoice.data?.formattedInvoices.length === 0) {
    redirect("/purchase-invoice");
  }
  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-10">
        {allPurchaseInvoice.data?.formattedInvoices?.map((invoice, index) => (
          <div className="bg-background p-4 border rounded-md" key={invoice.id}>
            <div className="flex flex-col gap-2">
              <div className="p-2 rounded-full bg-primary text-white max-w-max mx-auto">
                <FileText size={20} />
              </div>
              <p className="text-muted-foreground text-center ">
                {invoice.name}
              </p>
              <p className="text-muted-foreground text-center text-sm">
                پسووڵەی : {invoice.invoice_number}
              </p>
              <p className="flex justify-center items-center gap-1 text-muted-foreground text-center">
                <span>IQD</span>
                {invoice?.total?.toLocaleString()}
              </p>
              <div className="flex justify-between items-center">
                <Link
                  href={`purchase-invoice/${invoice.id}`}
                  className="p-1 rounded-full text-soft_primary hover:bg-primary hover:text-white cursor-pointer transition-all duration-500  max-w-max ml-auto"
                >
                  <CircleArrowRight size={20} />
                </Link>
                <p className="text-xs text-muted-foreground">
                  {format(invoice.createdAt, "P")}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="my-10">
        <PaginatedComponent
          currentPage={page}
          totalPages={allPurchaseInvoice.data?.totalPage || 1}
        />
      </div>
    </>
  );
}
export default FeedPurchaseInvoice;
