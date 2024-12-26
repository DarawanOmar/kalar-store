"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Trash2 } from "lucide-react";
import React from "react";
import { DataTableColumnHeader } from "@/components/reuseable/data-table-column-header";
import { deletePurchaseItemProdcut } from "../../_actions";
import { toast, Toaster } from "sonner";

const column: ColumnDef<{
  id: number | undefined;
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
      return <div>{row.original.purchase_price?.toLocaleString()}</div>;
    },
  },

  {
    id: "actions",
    accessorKey: "delete",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="سڕینەوە" />
    ),
    cell: function CellComponent({ row }) {
      const { id } = row.original;
      const handleDelete = async () => {
        const res = await deletePurchaseItemProdcut(id as number);
        if (res.success) {
          toast.success("بە سەرکەوتویی سڕایەوە");
        } else {
          toast.error("هەڵەیەک هەیە");
        }
      };
      return (
        <div className="flex justify-center items-center">
          <Trash2
            onClick={handleDelete}
            color="red"
            className="size-9 rounded-lg ms-4 bg-red200 p-2 cursor-pointer"
          />
        </div>
      );
    },
  },
];

export default column;
