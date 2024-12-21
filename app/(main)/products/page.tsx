import React, { Suspense } from "react";
import { getAllProducts } from "./_action";
import { Button } from "@/components/ui/button";
import Search from "@/components/reuseable/search";
import ModalAddProcut from "./_components/form/modal-add-product";
import FeedProducts from "./_components/feed-products";
import SkelotonCard from "@/components/reuseable/skeloton-card";
import PaginatedComponent from "@/components/ui/pagination";

async function Products() {
  // const allProducts = await getAllProducts();
  // console.log(allProducts);
  return (
    <div className="">
      <div className="flex justify-between items-center my-10 max-sm:gap-4">
        <ModalAddProcut />
        <Search palceHolder="گەڕانی کاڵا..." />
      </div>
      <div className="">
        <Suspense
          fallback={
            <SkelotonCard
              height="h-40 rounded-3xl"
              className="grid-cols-1 sm:grid-cols-2 xl:grid-cols-3"
            />
          }
        >
          <FeedProducts />
        </Suspense>
        <div className="my-5">
          <PaginatedComponent currentPage={1} totalPages={1} />
        </div>
      </div>
    </div>
  );
}

export default Products;
