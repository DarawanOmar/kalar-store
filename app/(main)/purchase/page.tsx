import React from "react";
import Addinvoice from "./_components/form/add-invoice";
import AddPurchaseProduct from "./_components/form/add-products";
import ShownPurchaseProducts from "./_components/shown-purchase-products";
import Title from "@/components/reuseable/title";
import { FileText } from "lucide-react";
import GetAllinvoice from "./_components/getAllinvoice";
import { unFinishedInvoice } from "./_actions";

async function Purchase({ searchParams }: { searchParams: searchParamsType }) {
  const invoice_id = Number((await searchParams).invoice_id);
  const getUnFinishedInvoice = await unFinishedInvoice();
  return (
    <div className="mb-10 mt-5">
      <div className="mb-5 sm:px-6 flex justify-between items-center ">
        <Title icon={<FileText size={18} />} text="دروستکردنی پسووڵە" />
        <GetAllinvoice unFinishInvoice={getUnFinishedInvoice.data || []} />
      </div>
      <Addinvoice />
      <div className="my-14">
        <AddPurchaseProduct />
      </div>
      <ShownPurchaseProducts invoice_id={invoice_id} />
    </div>
  );
}

export default Purchase;
