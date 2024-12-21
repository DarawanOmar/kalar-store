import React from "react";
import AddSale from "./_components/form/sale-form";
import AddsaleProduct from "./_components/form/add-products";
import ShownPurchaseProducts from "./_components/form/shown-purchase-products";

function Sale() {
  return (
    <div>
      <div className="mt-5 mb-10">
        <AddSale />
      </div>
      <div className="">
        <AddsaleProduct />
      </div>
      <ShownPurchaseProducts />
    </div>
  );
}

export default Sale;
