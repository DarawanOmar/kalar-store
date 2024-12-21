"use client";

import { ColumnDef } from "@tanstack/react-table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { EditIcon, MoreVertical, Trash2, TrashIcon } from "lucide-react";
import React from "react";
import { DataTableColumnHeader } from "@/components/reuseable/data-table-column-header";
import ReusableDeleteDailog from "@/components/reuseable/reusable-delete-dialog";
import CustomDialog from "@/components/reuseable/resusable-dialog";
import { PurchaseProducts } from "../../_type";

const column: ColumnDef<PurchaseProducts>[] = [
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
  },

  {
    id: "actions",
    cell: function CellComponent({ row }) {
      const [open, setOpen] = React.useState(false);
      const handleClose = () => setOpen((prev) => !prev);
      const { id } = row.original;
      return (
        <div className="">
          <Trash2
            color="red"
            className="size-9 rounded-lg ms-4 bg-red200 p-2 cursor-pointer"
          />
        </div>
      );
    },
  },
];

export default column;
