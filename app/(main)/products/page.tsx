import React, { Suspense } from "react";
import Search from "@/components/reuseable/search";
import ModalAddProcut from "./_components/form/modal-add-product";
import FeedProducts from "./_components/feed-products";
import SkelotonCard from "@/components/reuseable/skeloton-card";
import PaginatedComponent from "@/components/ui/pagination";

async function Products({ searchParams }: { searchParams: searchParamsType }) {
  return (
    <div className="">
      <div className="flex justify-between items-center my-10 max-sm:gap-4">
        <ModalAddProcut />
        <Search palceHolder="گەڕانی باڕکۆد یان کاڵا" />
      </div>
      <div className="">
        <Suspense
          fallback={
            <SkelotonCard
              height="h-40 rounded-xl"
              className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-10"
            />
          }
        >
          <FeedProducts searchParams={searchParams} />
        </Suspense>
        <div className="my-5">
          <PaginatedComponent currentPage={1} totalPages={1} />
        </div>
      </div>
    </div>
  );
}

export default Products;
