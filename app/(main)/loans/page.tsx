<<<<<<< HEAD
import Search from "@/components/reuseable/search";
import { DataTable } from "@/components/reuseable/table";
import TotalShown from "@/components/reuseable/total-shown";
import React from "react";
import column from "./_components/columns";
import { getAllLoans } from "./_actions";
import { DatePickerWithRange } from "@/components/layout/date-picker-with-range";

async function LoansPage({ searchParams }: { searchParams: searchParamsType }) {
  const page = Number((await searchParams).page || 1);
  const search = (await searchParams).search || "";
  const allLaons = await getAllLoans(search as string, page);
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
          totalPage={1}
          currentPage={page}
        />
      </div>
    </div>
  );
=======
import React from "react";

function LoansPage() {
  return <div>LoansPage</div>;
>>>>>>> 30ac0a7a4be69a854df94344c503056b89d66d2f
}

export default LoansPage;
