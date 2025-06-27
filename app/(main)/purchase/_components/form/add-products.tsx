"use client";

import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import React, { useTransition } from "react";
import { LuLoaderCircle } from "react-icons/lu";
import { addProductPurchase, addProductPurchaseType } from "../../_type";
import { FileText, Plus } from "lucide-react";
import Title from "@/components/reuseable/title";
import { addProductPurchaseAction, getProductByBarcode } from "../../_actions";
import { useQueryState } from "nuqs";
import { useQuery } from "@tanstack/react-query";
import { SelectWithSearchFormField } from "@/components/select-with-search";
import { TextField } from "@/components/reuseable/input-form-reusable";

export default function AddPurchaseProduct() {
  const [pendding, setPendding] = useTransition();
  const [invoice_id] = useQueryState("invoice_id");
  const form = useForm<addProductPurchaseType>({
    resolver: zodResolver(addProductPurchase),
    defaultValues: {
      id: 0,
      name: "",
      quantity: 0,
      purchase_price: 0,
    },
  });
  const name = form.watch("name");
  const { data: products = [] } = useQuery({
    queryKey: ["products"],
    queryFn: async () => {
      const res = await getProductByBarcode("" as string, "" as string);
      return res.data || [];
    },
  });
  React.useEffect(() => {
    const nameMatch = products.find((product) => product.name === name);
    if (nameMatch) {
      form.reset({
        id: nameMatch.id || 0,
        purchase_price: nameMatch?.purchase_price || 0,
        name: nameMatch?.name || "",
        quantity: 1,
      });
    }
  }, [name, products]);
  function onSubmit(values: addProductPurchaseType) {
    console.log(values);
    if (!invoice_id)
      return toast.error(" تکایە پسوڵەکە دیاری بکە یان دانەیەک دروست بکە");
    setPendding(async () => {
      const result = await addProductPurchaseAction(Number(invoice_id), values);
      if (result.success) {
        toast.success(result.message);
        form.reset({
          id: 0,
          purchase_price: 0,
          name: "",
          quantity: 0,
        });
      } else {
        toast.error(result.message);
      }
    });
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="sm:px-6">
        <Title
          icon={<FileText size={18} />}
          text="زیادکردنی بەرهەم"
          className="mb-8"
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 2xl:grid-cols-5  gap-5 items-end">
          <SelectWithSearchFormField
            control={form.control}
            name="name"
            label="ناو"
            description=""
            options={products.map((product) => ({
              value: product.name,
              label: product.name,
            }))}
          />

          <TextField
            control={form.control}
            name="purchase_price"
            placeholder="نرخی کڕین"
          />
          <TextField control={form.control} name="quantity" placeholder="بڕ" />
          <Button
            type="submit"
            disabled={pendding}
            variant={"gooeyRight"}
            className="flex gap-1"
          >
            {pendding ? (
              <LuLoaderCircle className="animate-spin transition-all duration-500" />
            ) : (
              <Plus size={18} strokeWidth={2.5} />
            )}
            زیادکردن
          </Button>
        </div>
      </form>
    </Form>
  );
}
