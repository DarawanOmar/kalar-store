"use client";

import { ColumnDef } from "@tanstack/react-table";
import React from "react";
import { DataTableColumnHeader } from "@/components/reuseable/data-table-column-header";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

const column: ColumnDef<any>[] = [
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
      <DataTableColumnHeader column={column} title="بابەت" />
    ),
  },
  {
    accessorKey: "user",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="کێ" />
    ),
  },
  {
    accessorKey: "added_by",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="لەلایەن" />
    ),
    cell: function CellComponent({ row }) {
      return (
        <div>{row.original.added_by === "person" ? "کەسەکەوە" : "سیستەم"}</div>
      );
    },
  },

  {
    accessorKey: "amount",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="بڕ" />
    ),
    cell: function CellComponent({ row }) {
      return <div>{row.original.amount.toLocaleString()}</div>;
    },
  },
  {
    accessorKey: "type_action",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="جۆر" />
    ),
    cell: function CellComponent({ row }) {
      return (
        <div
          className={cn("", {
            "text-green-500": row.original.type_action === "deposit",
            "text-red-500": row.original.type_action === "withdraw",
          })}
        >
          {row.original.type_action === "deposit" ? "زیادکردن" : "کەمکردن"}
        </div>
      );
    },
  },

  {
    accessorKey: "created_at",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="بەروار" />
    ),
    cell: function CellComponent({ row }) {
      return <div>{format(row.original.created_at, "yyyy-M-d")}</div>;
    },
  },
  {
    accessorKey: "time",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="کات" />
    ),
    cell: function CellComponent({ row }) {
      return <div dir="ltr">{format(row.original.created_at, "p")}</div>;
    },
  },
];

export default column;
