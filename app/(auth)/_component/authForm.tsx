"use client";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginAction } from "../_actions/actions";
import { toast } from "sonner";
import { login } from "@/lib/utils/cookies";
import { useForm } from "react-hook-form";
import { MdEmail } from "react-icons/md";
import { PasswordInput } from "@/components/ui/password-input";
import { loginSchema, loginSchemaType } from "./lib";
import { useTransition } from "react";
import LoadingButton from "@/components/ui/loadingButton";
import { RiLockPasswordFill } from "react-icons/ri";

export default function AuthForm() {
  const [pendding, startTransition] = useTransition();
  const form = useForm<loginSchemaType>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmit(values: loginSchemaType) {
    startTransition(async () => {
      const res = await loginAction(values);
      if (res?.success) {
        login(res.message, "/");
        toast.success(res.message);
      } else {
        toast.error(res?.message?.toString(), {
          cancel: {
            label: "Close",
            onClick: () => toast.dismiss(),
          },
        });
      }
    });
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-4 md:space-y-8 font-sirwan_reguler"
      >
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>ئیمەیڵ</FormLabel>
              <FormControl>
                <Input Icon={MdEmail} placeholder="ئیمەیڵ" {...field} />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>پاسۆرد</FormLabel>
              <FormControl>
                <PasswordInput
                  Icon={RiLockPasswordFill}
                  placeholder="پاسۆرد"
                  {...field}
                />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />
        <LoadingButton
          loading={pendding}
          type="submit"
          className="w-full font-sirwan tracking-[1px] bg-dark_primary"
          size="lg"
        >
          چوونەژوورەوە
        </LoadingButton>
      </form>
    </Form>
  );
}
