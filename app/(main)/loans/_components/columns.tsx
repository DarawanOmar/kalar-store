"use client";

import { ColumnDef } from "@tanstack/react-table";
import React from "react";
import { DataTableColumnHeader } from "@/components/reuseable/data-table-column-header";
import { format } from "date-fns";
import ModalPayForm from "./form/modal-pay-form";
import Link from "next/link";

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
    cell: function CellComponent({ row }) {
      return (
        <div className="">
          <Link href={`/loans/${row.original.id}`}>{row.original?.name}</Link>
        </div>
      );
    },
  },

  {
    accessorKey: "invoice_number",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="ژمارەی پسوڵە" />
    ),
  },
  {
    accessorKey: "phone",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="ژمارەی مۆبایل" />
    ),
  },
  {
    accessorKey: "paid_amount",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="کۆتا پارەی دراو" />
    ),
    cell: function CellComponent({ row }) {
      return <div>{row.original.paid_amount?.toLocaleString()}</div>;
    },
  },
  {
    accessorKey: "discount",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="داشکاندن" />
    ),
    cell: function CellComponent({ row }) {
      return <div>{row.original.discount?.toLocaleString()}</div>;
    },
  },
  {
    accessorKey: "remaining_amount",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="بڕی پارەی ماوە" />
    ),
    cell: function CellComponent({ row }) {
      return <div>{row.original.remaining_amount?.toLocaleString()}</div>;
    },
  },
  {
    accessorKey: "total_amount",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="کۆی گشتی" />
    ),
    cell: function CellComponent({ row }) {
      return <div>{row.original.total_amount?.toLocaleString()}</div>;
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
      return <div>{format(row.original?.createdAt, "yyyy-M-d")}</div>;
    },
  },
  {
    id: "action",
    accessorKey: "payemnt",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="پارەدان" />
    ),
    cell: function CellComponent({ row }) {
      return (
        <ModalPayForm
          info={{
            id: row.original?.id,
            lastPaymentAmount: row.original?.paid_amount || 0,
            lastPaymentDate: row.original?.updatedAt || 0,
            remainingAmount: row.original?.remaining_amount || 0,
            totalAmount: row.original?.total_amount || 0,
          }}
        />
      );
    },
  },
];

export default column;
