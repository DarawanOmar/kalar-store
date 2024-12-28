"use client";

import { ColumnDef } from "@tanstack/react-table";
import { EditIcon, MoreVertical, Trash2, TrashIcon } from "lucide-react";
import React from "react";
import { DataTableColumnHeader } from "@/components/reuseable/data-table-column-header";
import { SaleInvoice } from "../_type";

const column: ColumnDef<{
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
];

export default column;
