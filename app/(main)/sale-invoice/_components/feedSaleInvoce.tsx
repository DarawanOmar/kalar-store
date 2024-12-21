import { ArrayProduct } from "@/constants";
import React from "react";
import CardSale from "./card-sale";

async function FeedSaleInvoice() {
  await new Promise((resolve) => setTimeout(resolve, 1000));
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-10">
      {ArrayProduct.map((product, index) => (
        <CardSale key={index} product={product} />
      ))}
    </div>
  );
}
export default FeedSaleInvoice;
