import { CircleArrowRight, FileText } from "lucide-react";
import Link from "next/link";
import React from "react";
import { SaleInvoice } from "../_type";
import { format } from "date-fns";

type Props = {
  product: SaleInvoice;
};

function CardSale({ product }: Props) {
  return (
    <div className="bg-background p-4 border rounded-md relative">
      {product.is_discount && product.discount ? (
        <>
          <div className="burst-12" id="burst-12"></div>
          <div className="absolute top-2.5 left-[1px] text-xs text-white">
            %{((product.discount / product.total) * 100).toFixed(1)}
          </div>
        </>
      ) : null}
      <div className="flex flex-col gap-2">
        <div className="p-2 rounded-full bg-primary text-white max-w-max mx-auto">
          <FileText size={20} />
        </div>
        <p className="text-muted-foreground text-center text-sm">
          {product.name}
        </p>
        <p className="text-muted-foreground text-center text-sm">
          پسووڵەی : {product.invoice_number}
        </p>
        <p className="flex justify-center items-center gap-1 text-muted-foreground text-center">
          <span>IQD</span>
          {product.total.toLocaleString()}
        </p>
        <div className="flex justify-between items-center">
          <Link
            href={`sale-invoice/${product.id}`}
            className="p-1 rounded-full text-soft_primary hover:bg-primary hover:text-white cursor-pointer transition-all duration-500  max-w-max ml-auto"
          >
            <CircleArrowRight size={20} />
          </Link>
          <p className="text-xs text-muted-foreground">
            {format(product.createdAt, "P")}
          </p>
        </div>
      </div>
    </div>
  );
}

export default CardSale;
