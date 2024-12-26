import React from "react";
import CardSale from "./card-sale";
import { getAllCompleteSaleInvoice } from "../_lib";

async function FeedSaleInvoice() {
  const allSaleInvoice = await getAllCompleteSaleInvoice();
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-10">
      {allSaleInvoice.data?.formattedInvoices.map((product, index) => (
        <CardSale key={index} product={product} />
      ))}
    </div>
  );
}
export default FeedSaleInvoice;
