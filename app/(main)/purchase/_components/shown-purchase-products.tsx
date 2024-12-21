import { DataTable } from "@/components/reuseable/table";
import React from "react";
import column from "./form/columns";
import Title from "@/components/reuseable/title";
import { SquareKanban } from "lucide-react";

function ShownPurchaseProducts() {
  return (
    <div className="px-6">
      <Title
        icon={<SquareKanban size={18} />}
        text="بەرهەماکان"
        className="mb-8"
      />
      <DataTable
        data={[]}
        columns={column}
        havePagination={false}
        isSearch={false}
      />
    </div>
  );
}

export default ShownPurchaseProducts;
