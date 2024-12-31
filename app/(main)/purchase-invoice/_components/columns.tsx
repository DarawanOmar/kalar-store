"use client";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ColumnDef } from "@tanstack/react-table";
import { EditIcon, MoreVertical } from "lucide-react";
import React from "react";
import { DataTableColumnHeader } from "@/components/reuseable/data-table-column-header";
import { Button } from "@/components/ui/button";
import CustomDialog from "@/components/reuseable/resusable-dialog";
import ReturnPurchaseItemForm from "./form/modal-add-user";

const column: ColumnDef<{
  purchase_invoice_item_id: number;
  product_id: number | undefined;
  name: string | undefined;
  barcode: string | undefined;
  quantity: number;
  purchase_price: number | undefined;
}>[] = [
  {
    accessorKey: "id",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="#" className="text-right" />
    ),
    cell: function CellComponent({ row }) {
      return <div>{row.index + 1}</div>;
    },
  },

  {
    accessorKey: "name",
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title="ناو"
        className="text-right"
      />
    ),
  },
  {
    accessorKey: "barcode",
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title="باڕکۆد"
        className="text-right"
      />
    ),
  },

  {
    accessorKey: "quantity",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="بڕ" />
    ),
  },
  {
    accessorKey: "purchase_price",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="نرخی کڕین" />
    ),
    cell: function CellComponent({ row }) {
      return (
        <div className="flex justify-center gap-1 items-center">
          <span>IQD</span>
          <span>{row.original.purchase_price?.toLocaleString()}</span>
        </div>
      );
    },
  },
  {
    id: "actions",
    cell: function CellComponent({ row }) {
      const [open, setOpen] = React.useState(false);
      const handleClose = () => setOpen((prev) => !prev);
      const { product_id, purchase_invoice_item_id } = row.original;
      return (
        <div className="">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="space-y-1" align="end">
              <DropdownMenuLabel className="text-center">
                کردارەکان
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <CustomDialog
                open={open}
                onOpenChange={setOpen}
                isFreshButtonPass
                title="گەڕاندنەوەی کاڵا"
                classContent="max-w-md"
                button={
                  <button className="flex gap-2 items-center font-sirwan_reguler  hover:bg-primary hover:text-white transition-all duration-500 p-2 rounded-lg w-full">
                    <EditIcon height={18} width={18} />
                    <span className="text-sm">گەڕاندنەوەی کاڵا</span>
                  </button>
                }
              >
                <ReturnPurchaseItemForm
                  product_id={product_id as number}
                  sale_invoice_item_id={purchase_invoice_item_id as number}
                  handleClose={handleClose}
                />
              </CustomDialog>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      );
    },
  },
];

export default column;
