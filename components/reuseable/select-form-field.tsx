"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

interface SelectOption {
  value: string;
  label: string;
}

interface ReusableSelectProps {
  control: any;
  name: string;
  label?: string;
  options: SelectOption[];
  placeholder?: string;
  className?: string;
  dir?: "rtl" | "ltr";
  description?: string;
}

export function SelectField({
  control,
  name,
  label,
  options,
  placeholder = "Select an option",
  className,
  dir = "ltr",
  description,
}: ReusableSelectProps) {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className={className}>
          {label && <FormLabel>{label}</FormLabel>}
          <Select
            dir={dir}
            onValueChange={field.onChange}
            defaultValue={field.value}
          >
            <FormControl>
              <SelectTrigger className="border-muted-foreground/10">
                <SelectValue placeholder={placeholder} />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              {options.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <FormMessage />
        </FormItem>
      )}
    />
  );
}
