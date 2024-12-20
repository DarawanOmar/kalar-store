import { ArrayProduct } from "@/constants";
import React from "react";
import CardProduct from "./card-product";
import PaginatedComponent from "@/components/ui/pagination";

async function FeedProducts() {
  //   Await for a Second
  await new Promise((resolve) => setTimeout(resolve, 1000));
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-10">
      {ArrayProduct.map((product, index) => (
        <CardProduct key={index} product={product} />
      ))}
    </div>
  );
}

export default FeedProducts;
