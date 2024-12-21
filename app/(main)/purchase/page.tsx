import React from "react";
import Addinvoice from "./_components/form/add-invoice";
import AddPurchaseProduct from "./_components/form/add-products";
import ShownPurchaseProducts from "./_components/shown-purchase-products";
import Title from "@/components/reuseable/title";
import { FileText } from "lucide-react";
import GetAllinvoice from "./_components/getAllinvoice";

function Purchase() {
  return (
    <div className="mb-10 mt-5">
      <div className="mb-5 sm:px-6 flex justify-between items-center ">
        <Title icon={<FileText size={18} />} text="دروستکردنی پسووڵە" />
        <GetAllinvoice />
      </div>
      <Addinvoice />
      <div className="my-14">
        <AddPurchaseProduct />
      </div>
      <ShownPurchaseProducts />
    </div>
  );
}

export default Purchase;
