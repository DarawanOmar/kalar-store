"use client";
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
  FormMessage,
} from "@/components/ui/form";
import { DialogClose } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { useTransition } from "react";
import { LuLoaderCircle } from "react-icons/lu";
import { addProduct, addProductType } from "../../_type";
import { addProducts, deleteIamge, updateProducts } from "../../_action";
import { UploadDropzone } from "@/utils/uploadthing";
import { UploadCloud } from "lucide-react";

type filmFormProps = {
  isEdit?: boolean;
  info?: addProductType;
  handleClose?: () => void;
  id?: number;
};

export default function AddProduct({
  isEdit,
  info,
  handleClose,
  id,
}: filmFormProps) {
  const [pendding, setPendding] = useTransition();
  const form = useForm<addProductType>({
    resolver: zodResolver(addProduct),
    defaultValues: getDefaultValues(info),
  });

  function onSubmit(values: addProductType) {
    setPendding(async () => {
      const result = isEdit
        ? await updateProducts(id as number, values)
        : await addProducts(values);
      if (result.success) {
        toast.success(result.message);
        handleClose && handleClose();
      } else {
        toast.error(result.message);
      }
    });
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="  px-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 gap-10">
          {Object.entries(form.getValues())
            .slice(0, 6)
            .map(([key, value]) => (
              <FormField
                key={key}
                control={form.control}
                name={key as any}
                render={({ field }) => {
                  const readOnly = key === "quantity";
                  return (
                    <FormItem className=" w-full  max-w-full">
                      <FormLabel>{labelTranslate(field.name)}</FormLabel>
                      <FormControl>
                        <Input
                          readOnly={readOnly}
                          {...field}
                          className={cn("w-full ", {
                            "border-red-500":
                              form.formState.errors[
                                field.name as keyof typeof form.formState.errors
                              ],
                          })}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  );
                }}
              />
            ))}
          {/* <div className="">
            <FormLabel>وێنە</FormLabel>
            <UploadDropzone
              endpoint="imageUploader"
              appearance={{
                button: "bg-primary text-white ",
                allowedContent: "text-primary",
                label: "text-primary",
                container: "border border-primary",
              }}
              className="text-primary "
              content={{
                label: "کلیک بکە یان وێنەکە ڕابکێشە",
                allowedContent: "وێنەکە کەمتر لە ١ MB بێت",
                uploadIcon(arg) {
                  return <UploadCloud size={40} />;
                },
              }}
              onClientUploadComplete={async (res) => {
                if (isEdit && info?.image && res[0].url) {
                  const url = info?.image;
                  const key = url.split("/").pop();
                  const response = await deleteIamge(key as string);
                  toast.success(response.message);
                }
                form.setValue("image", res[0].url);
                toast.success("بە سەرکەوتووی ئەپڵۆد کرا");
              }}
              onUploadError={(error: Error) => {
                toast.error(`کێشە: ${error.message}`);
              }}
            />
          </div> */}
          {/* <FormField
            control={form.control}
            name="image"
            render={({ field }) => (
              <>
                <FormLabel className="text-base">وێنە(مۆبایل)</FormLabel>
                <FileUploader
                  value={field.value ? [field.value] : null}
                  onValueChange={(files) => {
                    const selectedFile = files?.[0] || null;
                    field.onChange(selectedFile);
                  }}
                  dropzoneOptions={{
                    multiple: false,
                    maxFiles: 19,
                    maxSize: sizeImage,
                  }}
                  reSelect={true}
                  className="relative bg-background rounded-lg p-2"
                >
                  <FileInput className="outline-dashed outline-1 outline-white">
                    <div className="flex items-center justify-center flex-col pt-3 pb-4 w-full ">
                      {field.value && (
                        <FileUploaderItem
                          index={0}
                          aria-roledescription={`file containing ${field.value.name}`}
                          className="p-0 size-20"
                        >
                          <AspectRatio className="size-full">
                            <Image
                              src={URL.createObjectURL(field.value)} // Convert File to Object URL
                              alt={field.value.name} // Use file name as alt
                              className="object-cover rounded-md"
                              fill
                            />
                          </AspectRatio>
                        </FileUploaderItem>
                      )}
                      {!field.value && <FileSvgDraw />}
                    </div>
                  </FileInput>
                </FileUploader>
              </>
            )}
          /> */}
        </div>

        <div className=" max-w-lg mx-auto gap-16 w-full mt-10 flex  justify-between items-center ">
          <Button
            type="submit"
            variant={"gooeyRight"}
            className="w-full py-[23px]"
          >
            {pendding ? (
              <LuLoaderCircle className="animate-spin transition-all duration-500" />
            ) : isEdit ? (
              "گۆرانکاری"
            ) : (
              "تۆمارکردن"
            )}
          </Button>
          <DialogClose asChild>
            <Button
              type="button"
              variant={"gooeyRight"}
              className="w-full py-[23px] bg-transparent border border-primary "
            >
              ڕەتکردنەوە
            </Button>
          </DialogClose>
        </div>
      </form>
    </Form>
  );
}

const getDefaultValues = (values: Partial<addProductType> = {}) => {
  const defaultValues: addProductType = {
    name: "",
    barcode: "",
    purchase_price: 0,
    sale_price: 0,
    note: "",
    quantity: 0,
    image: null,
  };

  return { ...defaultValues, ...values };
};

function labelTranslate(name: string) {
  switch (name) {
    case "name":
      return "ناو";
    case "barcode":
      return "بارکۆد";
    case "note":
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
