import { DataTable } from "@/components/reuseable/table";
import React from "react";
import column from "./form/columns";
import Title from "@/components/reuseable/title";
import { SquareKanban } from "lucide-react";
import { getPurchasePorudcts } from "../_actions";

type Props = {
  products_purchase: {
    id: number;
    product_id: number | null;
    quantity: number;
    name: string;
    barcode: string;
    sale_price: number;
  }[];
};

async function ShownPurchaseProducts({ products_purchase }: Props) {
  return (
    <div className="sm:px-6 my-10">
      <Title
        icon={<SquareKanban size={18} />}
        text="بەرهەماکان"
        className="mb-8"
      />
      <DataTable
        data={products_purchase || []}
        columns={column}
        havePagination={false}
        isSearch={false}
      />
    </div>
  );
}

export default ShownPurchaseProducts;
