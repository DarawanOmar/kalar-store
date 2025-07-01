import React, { Suspense } from "react";
import Search from "@/components/reuseable/search";
import ModalAddProcut from "./_components/form/modal-add-product";
import FeedProducts from "./_components/feed-products";
import SkelotonCard from "@/components/reuseable/skeloton-card";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Products",
};

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
      </div>
    </div>
  );
}

export default Products;
