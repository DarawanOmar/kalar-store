import Search from "@/components/reuseable/search";
import { DataTable } from "@/components/reuseable/table";
import React from "react";
import column from "./components/columns";
import ModalAddExpenses from "./components/form/modal-add-expenses";
import TotalShown from "@/components/reuseable/total-shown";

function Expenses() {
  return (
    <div className="my-10">
      <div className="flex flex-col gap-5 sm:hidden my-10">
        <Search className="max-sm:w-full" />
        <div className="grid grid-cols-2 gap-4">
          <ModalAddExpenses />
          <TotalShown text="کۆی گشتی" total={150000} />
        </div>
      </div>

      <div className="hidden sm:flex flex-col sm:flex-row justify-between items-center my-10 max-sm:gap-5">
        <ModalAddExpenses />
        <div className="flex gap-4">
          <TotalShown text="کۆی گشتی" total={150000} />
          <Search />
        </div>
      </div>
      <div className="">
        <DataTable
          data={[
            {
              createdAt: "2021-09-01",
              description: " تێنینی نییە",
              id: 1,
              name: "ئاوی کارتۆن",
              price: 1500,
              quantity: 2,
              totalAmount: 3000,
            },
          ]}
          columns={column}
          isSearch={false}
        />
      </div>
    </div>
  );
}

export default Expenses;
