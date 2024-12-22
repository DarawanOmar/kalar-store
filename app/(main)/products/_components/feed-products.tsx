import React from "react";
import CardProduct from "./card-product";
import { getAllProducts } from "../_action";
import EmptyImage from "@/components/reuseable/empty-image";
import { Product } from "../_type";

async function FeedProducts({
  searchParams,
}: {
  searchParams: searchParamsType;
}) {
  const page = Number((await searchParams).page || 1);
  const search = (await searchParams).search || "";
  const allProducts: Product[] = await getAllProducts(search as string, page);
  if (allProducts.length === 0) return <EmptyImage />;
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-10">
      {allProducts.map((product, index) => (
        <CardProduct key={index} product={product} />
      ))}
    </div>
  );
}

export default FeedProducts;
