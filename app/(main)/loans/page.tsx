import React from "react";
import Search from "@/components/reuseable/search";
import { DataTable } from "@/components/reuseable/table";
import TotalShown from "@/components/reuseable/total-shown";
import column from "./_components/columns";
import { getAllLoans } from "./_actions";
import { DatePickerWithRange } from "@/components/layout/date-picker-with-range";
import { parseDateRange } from "@/lib/utils";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Loans",
};

async function LoansPage({ searchParams }: { searchParams: searchParamsType }) {
  const range = ((await searchParams).range as string) || "";
  const { startDate, endDate } = parseDateRange(range);
  const page = Number((await searchParams).page || 1);
  const search = (await searchParams).search || "";
  const allLaons = await getAllLoans(
    search as string,
    page,
    startDate,
    endDate
  );
  return (
    <div className="my-10">
      <div className="flex flex-col gap-5 sm:hidden my-10">
        <Search className="max-sm:w-full" />
        <div className="grid grid-cols-2 gap-4">
          <TotalShown text="کۆی گشتی" total={0} />
        </div>
      </div>

      <div className="hidden sm:flex flex-col sm:flex-row justify-end items-center my-10 max-sm:gap-5">
        <div className="flex gap-4">
          <TotalShown text="کۆی گشتی" total={allLaons.data?.totalAmount || 0} />
          {/* <Search /> */}
          <DatePickerWithRange />
        </div>
      </div>
      <div className="">
        <DataTable
          data={allLaons?.data?.data || []}
          columns={column}
          isSearch={false}
          totalPage={allLaons.data?.totalPage || 1}
          currentPage={page}
        />
      </div>
    </div>
  );
}

export default LoansPage;
