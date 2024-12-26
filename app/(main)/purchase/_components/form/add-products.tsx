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
import { useCallback, useEffect, useState, useTransition } from "react";
import { LuLoaderCircle } from "react-icons/lu";
import { addProductPurchase, addProductPurchaseType } from "../../_type";
import { Barcode, FileText, Grid2x2Check, Plus } from "lucide-react";
import Title from "@/components/reuseable/title";
import {
  addProductPurchaseAction,
  completeInvoiceAction,
  getProductByBarcode,
} from "../../_actions";
import { useRouter } from "next/navigation";
import { useQueryState } from "nuqs";

export default function AddPurchaseProduct() {
  const router = useRouter();
  const [pendding, setPendding] = useTransition();
  const [invoice_id, setInvoice_Id] = useQueryState("invoice_id", {
    clearOnDefault: true,
    defaultValue: "",
    shallow: false,
  });

  // const [invoice_id, setInvoice_Id] = useQueryState("invoice_id");
  const [products, setProducts] = useState<
    {
      id: number;
      quantity: number;
      createdAt: Date;
      updatedAt: Date;
      name: string;
      image: string | null;
      barcode: string;
      purchase_price: number;
      sale_price: number;
      note: string | null;
    }[]
  >([]);
  const [barcodeState, setBarcodeState] = useState("");
  const [barcodeQuery, setBarcodeQuery] = useQueryState("barcode", {
    defaultValue: "",
    clearOnDefault: true,
    shallow: false,
    throttleMs: 500,
  });
  const [penddingComplete, setPenddingComplete] = useTransition();
  const form = useForm<addProductPurchaseType>({
    resolver: zodResolver(addProductPurchase),
    defaultValues: {
      id: 0,
      barcode: "",
      name: "",
      quantity: 0,
      // purchase_price: 0,
    },
  });

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await getProductByBarcode(barcodeQuery);
        const data = res.data;
        setProducts(data || []);
      } catch (error) {
        console.error("Error fetching product:", error);
        toast.error("هەڵەیەک ڕوویدا لە کاتی وەرگرتنی زانیاری.");
      }
    };

    fetchProduct();
  }, [barcodeQuery]);

  const getProduct = useCallback(
    async (e: string) => {
      try {
        const res = await getProductByBarcode(e);
        if (!res.data || res.data.length === 0) {
          return toast.error("ئەم بارکۆدە بەرهەم نییە");
        }
        const data = res.data;
        form.setValue("id", data[0].id);
        form.setValue("barcode", data[0].barcode);
        form.setValue("name", data[0].name);
        // form.setValue("purchase_price", data[0].purchase_price);
        setBarcodeState(data[0].barcode);
      } catch (error) {
        console.error("Error fetching product:", error);
        toast.error("هەڵەیەک ڕوویدا لە کاتی وەرگرتنی زانیاری.");
      }
    },
    [barcodeState]
  );

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

  const completeInvoice = () => {
    if (!invoice_id)
      return toast.error(" تکایە پسوڵەکە دیاری بکە یان دانەیەک دروست بکە");
    setPenddingComplete(async () => {
      const result = await completeInvoiceAction(Number(invoice_id));
      if (result.success) {
        toast.success(result.message);
        router.refresh();
        form.reset();
        setInvoice_Id("");
        setBarcodeState("");
      } else {
        toast.error(result.message);
      }
    });
  };

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
              onValueChange={(e) => {
                getProduct(e);
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
                  onChange={(e) => {
                    setBarcodeQuery(e.target.value);
                  }}
                  Icon={Barcode}
                  className="rounded-md border-zinc-400 placeholder:text-muted-foreground placeholder:text-sm my-2"
                  placeholder="بارکۆد بنوسە..."
                />
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
          <Button
            onClick={completeInvoice}
            type="button"
            variant={"gooeyRight"}
            className="flex gap-2"
          >
            {penddingComplete ? (
              <LuLoaderCircle className="animate-spin transition-all duration-500" />
            ) : (
              <Grid2x2Check size={18} strokeWidth={2.5} />
            )}
            تەواوکردنی پسوڵە
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
