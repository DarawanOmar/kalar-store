import React from "react";
import ModalAddUser from "./_components/form/modal-add-user";
import { DataTable } from "@/components/reuseable/table";
import column from "./_components/columns";
import Search from "@/components/reuseable/search";
import Title from "@/components/reuseable/title";
import { Bot } from "lucide-react";
import { getAllUsers } from "./_action";

async function UserPage({ searchParams }: { searchParams: searchParamsType }) {
  const page = Number((await searchParams).page || 1);
  const search = (await searchParams).search || "";
  const allUser = await getAllUsers(search as string, page);
  return (
    <div className="my-10">
      <div className="flex flex-col gap-5 sm:hidden my-10">
        <Search className="max-sm:w-full" />
        <div className="grid grid-cols-2 gap-4">
          <Title icon={<Bot />} text="بەکارهێنەر" />
          <ModalAddUser />
        </div>
      </div>

      <div className="hidden sm:flex flex-col sm:flex-row justify-between items-center my-10 max-sm:gap-5">
        <Title icon={<Bot />} text="بەکارهێنەر" />
        <div className="flex gap-4">
          <ModalAddUser />
          <Search />
        </div>
      </div>
      <div className="">
        <DataTable
          data={allUser.data?.data || []}
          columns={column}
          isSearch={false}
          currentPage={page}
          totalPage={allUser.data?.totalPage || 1}
        />
      </div>
    </div>
  );
}

export default UserPage;
