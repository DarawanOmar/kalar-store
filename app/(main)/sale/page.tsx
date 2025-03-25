import React from "react";
import AddsaleProduct from "./_components/form/add-products";
import { DataTable } from "@/components/reuseable/table";
import CompleteSale from "./_components/form/complete-sale";
import Title from "@/components/reuseable/title";
import { FileText, SquareKanban } from "lucide-react";
import GetAllSaleinvoice from "./_components/getAllinvoice";
import { getAllUnfinishSaleInvoice, getOneSaleInvoice } from "./_actions";
import column from "./_components/columns";
import AddSaleInvoice from "./_components/form/sale-form";

async function Sale({ searchParams }: { searchParams: searchParamsType }) {
  const invoice_id = Number((await searchParams).invoice_id);
  const [getAllunfinishInvoice, getActiveInvoice] = await Promise.all([
    getAllUnfinishSaleInvoice(),
    getOneSaleInvoice(invoice_id),
  ]);

  return (
    <>
      <div className="mt-5">
        <div className="mb-5 sm:px-6 flex justify-between items-center ">
          <Title icon={<FileText size={18} />} text="دروستکردنی پسووڵە" />
          <GetAllSaleinvoice
            unFinishInvoice={getAllunfinishInvoice.data || []}
          />
        </div>
      </div>
      <div className="mt-5 mb-10">
        <AddSaleInvoice
          key={invoice_id}
          info={{
            type: getActiveInvoice.data?.type,
            invoice_number: getActiveInvoice.data?.invoice_number,
            name: getActiveInvoice.data?.name,
            phone: getActiveInvoice.data?.phone,
            note: getActiveInvoice.data?.note as string,
            place: getActiveInvoice.data?.place,
          }}
        />
      </div>
      <div className="">
        <AddsaleProduct />
      </div>
      <CompleteSale
        type={getActiveInvoice.data?.type as "loan" | "cash"}
        total={getActiveInvoice.data?.total || 0}
      />
      <div className="sm:px-6 my-10">
        <Title
          icon={<SquareKanban size={18} />}
          text="بەرهەماکان"
          className="mb-8"
        />
        <DataTable
          data={getActiveInvoice.data?.Products || []}
          columns={column}
          havePagination={false}
          isSearch={false}
        />
      </div>
    </>
  );
}

export default Sale;
