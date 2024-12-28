"use client";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import React, { useTransition } from "react";
import { LuLoaderCircle } from "react-icons/lu";
import { addProductPurchase, addProductPurchaseType } from "../../_type";
import { FileText, Plus } from "lucide-react";
import Title from "@/components/reuseable/title";
import { addProductPurchaseAction, getProductByBarcode } from "../../_actions";
import { useQueryState } from "nuqs";
import { useQuery } from "@tanstack/react-query";

export default function AddPurchaseProduct() {
  const [pendding, setPendding] = useTransition();
  const [invoice_id] = useQueryState("invoice_id");
  // This state for empty the barcode input after submit
  const [barcodeState, setBarcodeState] = React.useState("");
  const [barcodeQuery, setBarcodeQuery] = useQueryState("barcode", {
    defaultValue: "",
    clearOnDefault: true,
    shallow: false,
    throttleMs: 500,
  });
  const form = useForm<addProductPurchaseType>({
    resolver: zodResolver(addProductPurchase),
    defaultValues: {
      id: 0,
      barcode: "",
      name: "",
      quantity: 0,
    },
  });

  const {
    data: products = [],
    isError,
    isLoading,
  } = useQuery({
    queryKey: ["products", barcodeQuery],
    queryFn: async () => {
      const res = await getProductByBarcode(barcodeQuery);
      return res.data || [];
    },
    staleTime: 300000, // Cache data for 5 minutes
  });

  function onSubmit(values: addProductPurchaseType) {
    if (!invoice_id)
      return toast.error(" تکایە پسوڵەکە دیاری بکە یان دانەیەک دروست بکە");
    setPendding(async () => {
      const result = await addProductPurchaseAction(
        Number(invoice_id),
        values.id as number,
        values.quantity
      );
      if (result.success) {
        toast.success(result.message);
        form.reset();
        setBarcodeQuery("");
        setBarcodeState("");
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

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5  gap-5 items-end">
          <div className="grid gap-3">
            <FormLabel>باڕکۆد</FormLabel>
            <Select
              dir="rtl"
              value={barcodeState}
              onValueChange={async (e) => {
                try {
                  const barcode = e as string;
                  const res = await getProductByBarcode(barcode);
                  if (!res.data || res.data.length === 0) {
                    return toast.error("ئەم بارکۆدە بەرهەم نییە");
                  }
                  const product = res.data[0];
                  form.setValue("id", product.id);
                  form.setValue("barcode", product.barcode);
                  form.setValue("name", product.name);
                  setBarcodeState(product.barcode);
                } catch {
                  toast.error("هەڵەیەک ڕوویدا لە کاتی وەرگرتنی زانیاری.");
                }
              }}
            >
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <Input
                  value={barcodeQuery}
                  onChange={(e) => setBarcodeQuery(e.target.value)}
                  onFocus={(e) =>
                    e.target.setSelectionRange(
                      e.target.value.length,
                      e.target.value.length
                    )
                  }
                  className="rounded-md border-zinc-400 placeholder:text-muted-foreground placeholder:text-sm my-2"
                  placeholder="بارکۆد بنوسە..."
                  onBlur={() => {}}
                />
                {isLoading ? (
                  <div className="flex justify-center items-center gap-2 text-sm text-center my-4 font-sirwan_meduim">
                    <span>چاوەرێبکە</span>
                    <LuLoaderCircle className="animate-spin transition-all duration-500" />
                  </div>
                ) : null}
                {isError ? (
                  <div className="text-red-500 text-sm text-center my-4 font-sirwan_meduim">
                    هەڵەیەک ڕوویدا
                  </div>
                ) : null}

                {products.length === 0 ? (
                  <div className="text-red-500 text-sm text-center my-4 font-sirwan_meduim">
                    هیچ بەرهەمێک نییە
                  </div>
                ) : (
                  products.map((product) => (
                    <SelectItem
                      key={product.id}
                      value={product.barcode}
                      className="flex justify-center items-center text-center"
                    >
                      {product.name}
                    </SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>
          </div>

          {Object.entries(form.getValues())
            .slice(2)
            .map(([key, value]) => (
              <FormField
                key={key}
                control={form.control}
                name={key as any}
                render={({ field }) => (
                  <FormItem className=" w-full  max-w-full">
                    <FormLabel>{labelTranslate(field.name)}</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        className={cn("w-full ", {
                          "border-red-500":
                            form.formState.errors[
                              field.name as keyof typeof form.formState.errors
                            ],
                        })}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            ))}
          <Button type="submit" variant={"gooeyRight"} className="flex gap-1">
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

function labelTranslate(name: string) {
  switch (name) {
    case "name":
      return "ناو";
    case "barcode":
      return "بارکۆد";
    case "description":
      return "تێبینی";
    case "purchase_price":
      return "نرخی کڕین";
    case "sale_price":
      return "نرخی فرۆشتن";
    case "quantity":
      return "بڕ";
    default:
      return name;
  }
}
