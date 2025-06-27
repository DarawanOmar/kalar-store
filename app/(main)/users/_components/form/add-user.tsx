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
import { addUser, addUserType } from "../../_type";
import { addUserAction, updateUser } from "../../_action";
import { sizeImage } from "@/lib/globals";
import {
  FileInput,
  FileSvgDraw,
  FileUploader,
  FileUploaderItem,
} from "@/components/ui/file-upload";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import Image from "next/image";
import { UploadDropzone } from "@/utils/uploadthing";
import { UploadCloud } from "lucide-react";
import { deleteIamge } from "@/app/(main)/products/_action";

type filmFormProps = {
  isEdit?: boolean;
  info?: addUserType;
  handleClose?: () => void;
  id?: number;
};

export default function AddUser({
  isEdit,
  info,
  handleClose,
  id,
}: filmFormProps) {
  const [pendding, setPendding] = useTransition();
  const form = useForm<addUserType>({
    resolver: zodResolver(addUser),
    defaultValues: getDefaultValues(info),
  });

  function onSubmit(values: addUserType) {
    setPendding(async () => {
      const result = isEdit
        ? await updateUser(id as number, values)
        : await addUserAction(values);
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
        <div className="grid grid-cols-1  gap-5">
          {Object.entries(form.getValues())
            .slice(0, 3)
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
                    <FormMessage />
                  </FormItem>
                )}
              />
            ))}
          <div className="">
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
                if (isEdit && info?.image && res[0]?.url) {
                  const url = info?.image;
                  const key = url.split("/").pop();
                  await deleteIamge(key as string);
                }
                form.setValue("image", res[0].url);
                toast.success("بە سەرکەوتووی ئەپڵۆد کرا");
              }}
              onUploadError={(error: Error) => {
                toast.error(`کێشە: ${error.message}`);
              }}
            />
          </div>
        </div>

        <div className=" max-w-lg mx-auto gap-16 w-full mt-10 flex  justify-between items-center ">
          <Button
            type="submit"
            disabled={pendding}
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

const getDefaultValues = (values: Partial<addUserType> = {}) => {
  const defaultValues: addUserType = {
    name: "",
    email: "",
    password: "",
    image: "",
  };

  return { ...defaultValues, ...values };
};

function labelTranslate(name: string) {
  switch (name) {
    case "name":
      return "ناو";
    case "email":
      return "ئیمەیڵ";
    case "password":
      return "پاسۆرد";
    default:
      return name;
  }
}
