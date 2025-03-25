"use client";

import * as React from "react";
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { DataTableViewOptions } from "./data-table-view-option";
import PaginatedComponent from "../ui/pagination";

interface DataTableProps<TData, TValue> {
  data: TData[];
  columns: ColumnDef<TData, TValue>[];
  havePagination?: boolean;
  isSearch?: boolean;
  nameSearch?: string;
  totalPage?: number;
  currentPage?: number;
  pageSize?: number;
}

export function DataTable<TData, TValue>({
  data,
  columns,
  havePagination = true,
  isSearch = true,
  nameSearch,
  currentPage,
  totalPage,
  pageSize,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});

  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
      pagination: {
        pageIndex: 0,
        pageSize: pageSize || 50,
      },
    },
  });

  return (
    <div className="w-full">
      {isSearch && (
        <div className="flex items-center py-4 font-sirwan_reguler ">
          <Input
            placeholder="گەڕان"
            value={
              (table
                .getColumn(nameSearch || "name")
                ?.getFilterValue() as string) ?? ""
            }
            onChange={(event) => {
              table
                .getColumn(nameSearch || "name")
                ?.setFilterValue(event.target.value);
            }}
            className="max-w-xs rounded-xl "
          />
          <DataTableViewOptions table={table} />
        </div>
      )}
      <div className="rounded-md p-2 border font-sans dark:border-white/5">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id} className="dark:border-white/5">
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead
                      className="text-primary  text-center   "
                      key={header.id}
                    >
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                  className="dark:border-white/5"
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell
                      className=" text-center font-sirwan_reguler "
                      key={cell.id}
                    >
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      {havePagination && (
        <div className="my-5">
          <PaginatedComponent
            currentPage={currentPage || 1}
            totalPages={totalPage || 1}
          />
        </div>
      )}
    </div>
  );
}
