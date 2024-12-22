import Search from "@/components/reuseable/search";
import { DataTable } from "@/components/reuseable/table";
import React from "react";
import column from "./components/columns";
import ModalAddExpenses from "./components/form/modal-add-expenses";
import TotalShown from "@/components/reuseable/total-shown";
import { getAllExpenses } from "./_action";

async function Expenses({ searchParams }: { searchParams: searchParamsType }) {
  const page = Number((await searchParams).page || 1);
  const search = (await searchParams).search || "";
  const allExpenses = await getAllExpenses(search as string, page);
  return (
    <div className="my-10">
      <div className="flex flex-col gap-5 sm:hidden my-10">
        <Search className="max-sm:w-full" />
        <div className="grid grid-cols-2 gap-4">
          <ModalAddExpenses />
          <TotalShown
            text="کۆی گشتی"
            total={allExpenses?.data?.totalAmount || 0}
          />
        </div>
      </div>

      <div className="hidden sm:flex flex-col sm:flex-row justify-between items-center my-10 max-sm:gap-5">
        <ModalAddExpenses />
        <div className="flex gap-4">
          <TotalShown
            text="کۆی گشتی"
            total={allExpenses?.data?.totalAmount || 0}
          />
          <Search />
        </div>
      </div>
      <div className="">
        <DataTable
          data={allExpenses?.data?.data || []}
          columns={column}
          isSearch={false}
          totalPage={allExpenses.data?.totalPage || 1}
          currentPage={page}
        />
      </div>
    </div>
  );
}

export default Expenses;
