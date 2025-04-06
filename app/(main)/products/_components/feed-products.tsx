import React from "react";
import CardProduct from "./card-product";
import { getAllProducts } from "../_action";
import EmptyImage from "@/components/reuseable/empty-image";
import { Product } from "../_type";
import PaginatedComponent from "@/components/ui/pagination";

async function FeedProducts({
  searchParams,
}: {
  searchParams: searchParamsType;
}) {
  const page = Number((await searchParams).page || 1);
  const search = (await searchParams).search || "";
  const allProducts = await getAllProducts(search as string, page, true);
  if (allProducts.products.length === 0) return <EmptyImage />;
  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-10">
        {allProducts.products.map((product, index) => (
          <CardProduct key={index} product={product} />
        ))}
      </div>
      <div className="my-5">
        <PaginatedComponent
          currentPage={page}
          totalPages={allProducts.totalPages || 0}
        />
      </div>
    </>
  );
}

export default FeedProducts;
