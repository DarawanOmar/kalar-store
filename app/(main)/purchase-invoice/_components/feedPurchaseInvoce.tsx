import React from "react";
import { getAllCompleteInvoice } from "../_lib";
import { CircleArrowRight, FileText } from "lucide-react";
import Link from "next/link";

async function FeedPurchaseInvoice() {
  const allPurchaseInvoice = await getAllCompleteInvoice();

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-10">
      {allPurchaseInvoice.data?.invoices?.map((product, index) => (
        <div className="bg-background p-4 border rounded-md" key={product.id}>
          <div className="flex flex-col gap-2">
            <div className="p-2 rounded-full bg-primary text-white max-w-max mx-auto">
              <FileText size={20} />
            </div>
            <p className="text-muted-foreground text-center text-sm">
              {product.name}
            </p>
            <p className="flex justify-center items-center gap-1 text-muted-foreground text-center">
              <span>IQD</span>
              {allPurchaseInvoice.data.total.toLocaleString()}
            </p>
            <Link
              href={`purchase-invoice/${product.name}`}
              className="p-1 rounded-full text-soft_primary hover:bg-primary hover:text-white cursor-pointer transition-all duration-500  max-w-max ml-auto"
            >
              <CircleArrowRight size={20} />
            </Link>
          </div>
        </div>
      ))}
    </div>
  );
}
export default FeedPurchaseInvoice;
