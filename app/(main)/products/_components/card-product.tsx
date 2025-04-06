import { AspectRatio } from "@radix-ui/react-aspect-ratio";
import React from "react";
import DropdownMenuProduct from "./dropdown";
import { Product } from "../_type";
import Image from "next/image";
import placeholder from "@/public/empty-product.jpg";
type Props = {
  product: Product;
};

function CardProduct({ product }: Props) {
  return (
    <div className="p-6 bg-background rounded-xl shadow-md border relative">
      <div className="absolute top-4 left-2">
        <DropdownMenuProduct product={product} />
      </div>
      <div className="flex justify-between items-center  w-full my-4">
        <div className="flex flex-col gap-2 items-center">
          <span className="text-xs">ناوی کاڵا</span>
          <span className="text-xs text-muted-foreground">{product.name}</span>
        </div>
        <div className="flex flex-col gap-2 items-center">
          <span className="text-xs">بارکۆد</span>
          <span className="text-xs text-muted-foreground">
            {product.barcode}
          </span>
        </div>
      </div>
      <AspectRatio ratio={3 / 2} className="overflow-hidden rounded-md ">
        <Image
          src={product.image ? `/${product.image}` : placeholder}
          alt={product.name}
          fill
          className="rounded object-cover transition-all"
        />
      </AspectRatio>
      <div className="flex justify-between items-center  w-full mt-5">
        <div className="flex flex-col gap-2 items-center">
          <span className="text-xs">نرخی کڕین</span>
          <span className="text-xs text-muted-foreground">
            {product.purchase_price.toLocaleString()}
          </span>
        </div>
        <div className="flex flex-col gap-2 items-center">
          <span className="text-xs">بڕ</span>
          <span className="text-xs text-muted-foreground">
            {product.quantity.toLocaleString()}
          </span>
        </div>
        <div className="flex flex-col gap-2 items-center">
          <span className="text-xs">نرخی فرۆشتن</span>
          <span className="text-xs text-muted-foreground">
            {product.sale_price.toLocaleString()}
          </span>
        </div>
      </div>
      <div className="text-center text-muted-foreground mt-4 text-xs">
        تێبینی: {product.note || "هیچ تێبینیەک نییە"}
      </div>
    </div>
  );
}

export default CardProduct;
