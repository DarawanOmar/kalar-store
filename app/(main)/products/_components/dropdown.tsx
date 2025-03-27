"use client";
import CustomDialog from "@/components/reuseable/resusable-dialog";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { EditIcon, EllipsisVertical, TrashIcon } from "lucide-react";
import React from "react";
import AddProduct from "./form/add-product";
import ReusableDeleteDailog from "@/components/reuseable/reusable-delete-dialog";
import { Product } from "../_type";
import { deleteProducts } from "../_action";

type Props = {
  product: Product;
};

function DropdownMenuProduct({ product }: Props) {
  const [open, setOpen] = React.useState(false);
  const handleClose = () => {
    setOpen((prev) => !prev);
  };
  return (
    <div>
      <Popover>
        <PopoverTrigger>
          <EllipsisVertical size={16} />
        </PopoverTrigger>
        <PopoverContent className="max-w-max  bg-soft_primary text-white rounded-lg border-none p-2 ">
          <div className="">
            <CustomDialog
              open={open}
              onOpenChange={setOpen}
              isFreshButtonPass
              classContent="max-w-3xl"
              title="گۆرانکاری"
              button={
                <button className="flex gap-2 items-center font-sirwan_reguler  hover:bg-primary p-2 rounded-lg ">
                  <EditIcon height={18} width={18} />
                  <span className="text-sm">گۆرانکاری</span>
                </button>
              }
            >
              <AddProduct
                isEdit
                id={product?.id}
                info={{
                  name: product?.name,
                  barcode: product?.barcode,
                  purchase_price: product?.purchase_price,
                  sale_price: product?.sale_price,
                  quantity: product?.quantity,
                  note: product?.note || "",
                  image: null,
                }}
                handleClose={handleClose}
              />
            </CustomDialog>
            {/* <hr className="border-gray" /> */}
            {/* <ReusableDeleteDailog
              title="دڵنیایت لە سڕینەوەی کاڵا"
              isFreshButtonPass
              button={
                <button className="flex gap-2 items-center font-sirwan_reguler  hover:bg-primary p-2 rounded-b-lg w-full ">
                  <TrashIcon height={18} width={18} />
                  <span className="text-sm">سڕینەوە</span>
                </button>
              }
              actionDelete={deleteProducts}
              id={product?.id}
            /> */}
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}

export default DropdownMenuProduct;
