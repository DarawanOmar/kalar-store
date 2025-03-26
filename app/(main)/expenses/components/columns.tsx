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
import { EditIcon, MoreVertical, TrashIcon } from "lucide-react";
import React from "react";
import { Expenses } from "../_type";
import { DataTableColumnHeader } from "@/components/reuseable/data-table-column-header";
import ReusableDeleteDailog from "@/components/reuseable/reusable-delete-dialog";
import CustomDialog from "@/components/reuseable/resusable-dialog";
import AddExpenses from "./form/add-expenses";
import { deleteExpenses } from "../_action";
import { format } from "date-fns";

const column: ColumnDef<Expenses>[] = [
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
    accessorKey: "quantity",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="بڕ" />
    ),
  },
  {
    accessorKey: "price",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="نرخ" />
    ),
    cell: function CellComponent({ row }) {
      return <div>{row.original.price.toLocaleString()}</div>;
    },
  },
  {
    accessorKey: "total",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="کۆی گشتی" />
    ),
    cell: function CellComponent({ row }) {
      return (
        <div>
          {(row.original.price * row.original.quantity).toLocaleString()}
        </div>
      );
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
      const [open, setOpen] = React.useState(false);
      const handleClose = () => setOpen((prev) => !prev);
      const { id } = row.original;
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
                title="گۆرانکاری"
                classContent="max-w-md"
                button={
                  <button className="flex gap-2 items-center font-sirwan_reguler  hover:bg-primary hover:text-white transition-all duration-500 p-2 rounded-t-lg w-full">
                    <EditIcon height={18} width={18} />
                    <span className="text-sm">گۆرانکاری</span>
                  </button>
                }
              >
                <AddExpenses
                  info={{
                    name: row.original.name,
                    price: row.original.price,
                    quantity: row.original.quantity,
                    note: row.original.note || "",
                  }}
                  id={id}
                  isEdit
                  handleClose={handleClose}
                />
              </CustomDialog>
              <hr className="border-gray" />
              <ReusableDeleteDailog
                title="دڵنیایت لە سڕینەوەی خەرجی"
                isFreshButtonPass
                button={
                  <button className="flex gap-2 items-center font-sirwan_reguler  hover:bg-primary hover:text-white transition-all duration-500 p-2 rounded-b-lg w-full ">
                    <TrashIcon height={18} width={18} />
                    <span className="text-sm">سڕینەوە</span>
                  </button>
                }
                actionDelete={deleteExpenses}
                id={id}
              />
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      );
    },
  },
];

export default column;
