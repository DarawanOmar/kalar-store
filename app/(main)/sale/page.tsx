import React from "react";
import AddSale from "./_components/form/sale-form";
import AddsaleProduct from "./_components/form/add-products";
import ShownPurchaseProducts from "./_components/form/shown-purchase-products";
import CompleteSale from "./_components/form/complete-sale";
import Title from "@/components/reuseable/title";
import { FileText } from "lucide-react";
import GetAllSaleinvoice from "./_components/getAllinvoice";
import { getAllUnfinishSaleInvoice } from "./_actions";

async function Sale() {
  const getAllunfinishInvoice = await getAllUnfinishSaleInvoice();
  // console.log(getAllunfinishInvoice);
  return (
    <div>
      <div className="mt-5">
        <div className="mb-5 sm:px-6 flex justify-between items-center ">
          <Title icon={<FileText size={18} />} text="دروستکردنی پسووڵە" />
          <GetAllSaleinvoice
            unFinishInvoice={getAllunfinishInvoice.data || []}
          />
        </div>
      </div>
      <div className="mt-5 mb-10">
        <AddSale />
      </div>
      <div className="">
        <AddsaleProduct />
      </div>
      <CompleteSale />
      <ShownPurchaseProducts />
    </div>
  );
}

export default Sale;
