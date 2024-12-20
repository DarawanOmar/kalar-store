import Search from "@/components/reuseable/search";
import { DataTable } from "@/components/reuseable/table";
import React from "react";
import column from "./components/columns";
import ModalAddExpenses from "./components/form/modal-add-expenses";

function Expenses() {
  return (
    <div className="my-10">
      <div className="flex justify-between items-center my-10">
        <ModalAddExpenses />
        <Search />
      </div>
      <div className="">
        <DataTable
          data={[
            {
              createdAt: "2021-09-01T00:00:00.000Z",
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
