import React from "react";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { IconType } from "react-icons/lib";
import { LucideIcon } from "lucide-react";

interface TextFieldProps {
  control: any;
  name: string;
  label?: string;
  placeholder?: string;
  type?: string;
  className?: string;
  classFormItem?: string;
  icon?: IconType | LucideIcon | React.ElementType;
  isShown?: boolean;
  disc?: string;
}

export const TextField: React.FC<TextFieldProps> = ({
  control,
  name,
  label,
  placeholder,
  classFormItem,
  type = "text",
  className,
  icon,
  isShown = true,
  disc,
}) => {
  return isShown ? (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className={cn("", classFormItem)}>
          {label && (
            <FormLabel className="font-sirwan-light text-xs">{label}</FormLabel>
          )}
          <FormControl>
            <Input
              placeholder={placeholder}
              className={cn("border-muted-foreground/30", className)}
              {...field}
              type={type}
            />
          </FormControl>
          <FormMessage />
          {disc ? (
            <FormDescription className="text-xs">{disc}</FormDescription>
          ) : null}
        </FormItem>
      )}
    />
  ) : null;
};
