import { DataTable } from "@/components/reuseable/table";
import React from "react";
import column from "./_components/column";
import { getAllProducts } from "../products/_action";

type Props = {
  searchParams: searchParamsType;
};

async function TrashProducts({ searchParams }: Props) {
  const page = Number((await searchParams).page) || 1;
  const search = ((await searchParams).search as string) || "";
  const res = await getAllProducts(search, page, false);
  return (
    <div className="my-10">
      <DataTable
        columns={column}
        data={res.products || []}
        nameSearch="name"
        currentPage={page}
        isSearch={false}
        totalPage={res.totalPages || 1}
      />
    </div>
  );
}

export default TrashProducts;
