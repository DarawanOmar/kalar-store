import { Product } from "@/constants";
import {
  ChevronsRight,
  CircleArrowRight,
  FastForward,
  FileText,
} from "lucide-react";
import Link from "next/link";
import React from "react";

type Props = {
  product: Product;
};

function CardSale({ product }: Props) {
  return (
    <div className="bg-background p-4 border rounded-md">
      <div className="flex flex-col gap-2">
        <div className="p-2 rounded-full bg-primary text-white max-w-max mx-auto">
          <FileText size={20} />
        </div>
        <p className="text-muted-foreground text-center text-sm">
          {product.name}
        </p>
        <p className="flex justify-center items-center gap-1 text-muted-foreground text-center">
          <span>IQD</span>
          {product.sale_price}
        </p>
        <Link
          href={`sale-invoice/${product.name}`}
          className="p-1 rounded-full text-soft_primary hover:bg-primary hover:text-white cursor-pointer transition-all duration-500  max-w-max ml-auto"
        >
          <CircleArrowRight size={20} />
        </Link>
      </div>
    </div>
  );
}

export default CardSale;
