import { DataTable } from "@/components/reuseable/table";
import React from "react";
import column from "./form/columns";
import Title from "@/components/reuseable/title";
import { SquareKanban } from "lucide-react";
import { getPurchasePorudcts } from "../_actions";

type Props = {
  invoice_id: number;
};

async function ShownPurchaseProducts({ invoice_id }: Props) {
  const getUnFinishedProducts = await getPurchasePorudcts(invoice_id);
  // console.log(getUnFinishedProducts.data);
  return (
    <div className="sm:px-6 my-10">
      <Title
        icon={<SquareKanban size={18} />}
        text="بەرهەماکان"
        className="mb-8"
      />
      <DataTable
        data={getUnFinishedProducts.data || []}
        columns={column}
        havePagination={false}
        isSearch={false}
      />
    </div>
  );
}

export default ShownPurchaseProducts;
