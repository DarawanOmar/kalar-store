"use client";

import { ColumnDef } from "@tanstack/react-table";
import React from "react";
import { DataTableColumnHeader } from "@/components/reuseable/data-table-column-header";
import ReusableDeleteDailog from "@/components/reuseable/reusable-delete-dialog";
import { format } from "date-fns";
import { deleteProducts } from "../../products/_action";
import { RiArrowGoBackLine } from "react-icons/ri";

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
      <DataTableColumnHeader
        column={column}
        title="ناو"
        className="text-right"
      />
    ),
  },
  {
    accessorKey: "sale_price",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="نرخی فرۆشتن" />
    ),
    cell: function CellComponent({ row }) {
      return <div>{row.original?.sale_price?.toLocaleString()}</div>;
    },
  },
  {
    accessorKey: "purchase_price",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="نرخی کڕین" />
    ),
    cell: function CellComponent({ row }) {
      return <div>{row.original?.purchase_price?.toLocaleString()}</div>;
    },
  },
  {
    accessorKey: "note",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="تێبینی" />
    ),
  },
  {
    accessorKey: "createdAt",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="بەروار" />
    ),
    cell: function CellComponent({ row }) {
      return <div>{format(row.original.createdAt, "yyyy-M-d")}</div>;
    },
  },
  {
    id: "actions",
    cell: function CellComponent({ row }) {
      const { id } = row.original;
      return (
        <div className="">
          <ReusableDeleteDailog
            title="دڵنیایت لە گەڕانەوەی بەرهەم"
            isFreshButtonPass
            button={
              <button className="">
                <RiArrowGoBackLine />
              </button>
            }
            actionDelete={deleteProducts}
            id={id}
          />
        </div>
      );
    },
  },
];

export default column;
