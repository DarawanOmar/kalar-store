"use client";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CheckIcon, ChevronDownIcon } from "lucide-react";
import React, { useId } from "react";
import { ControllerRenderProps, FieldValues } from "react-hook-form";

interface SelectOption {
  value: string;
  label: string;
}

interface SelectWithSearchProps {
  control: any;
  name: string;
  label: string;
  description?: string;
  options: SelectOption[];
  placeholder?: string;
  searchPlaceholder?: string;
  emptyMessage?: string;
  className?: string;
}

export function SelectWithSearchFormField({
  control,
  name,
  label,
  description,
  options,
  placeholder = "بۆ ناو بگەڕێ",
  searchPlaceholder = "Search...",
  emptyMessage = "No results found.",
  className,
}: SelectWithSearchProps) {
  const id = useId();

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className={className}>
          <FormLabel>{label}</FormLabel>
          <SelectWithSearch
            field={field}
            options={options}
            placeholder={placeholder}
            searchPlaceholder={searchPlaceholder}
            emptyMessage={emptyMessage}
          />
          {description && <FormDescription>{description}</FormDescription>}
          <FormMessage />
        </FormItem>
      )}
    />
  );
}

interface SelectWithSearchComponentProps {
  field: ControllerRenderProps<FieldValues, string>;
  options: SelectOption[];
  placeholder?: string;
  searchPlaceholder?: string;
  emptyMessage?: string;
}

export function SelectWithSearch({
  field,
  options,
  placeholder = "بۆ ناو بگەڕێ",
  searchPlaceholder = "Search...",
  emptyMessage = "No results found.",
}: SelectWithSearchComponentProps) {
  const [open, setOpen] = React.useState(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <FormControl>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className={cn(
              "w-full justify-between bg-background hover:bg-background  px-3  outline-none border-muted-foreground/30",
              !field.value && "text-muted-foreground"
            )}
          >
            <span className="truncate">
              {field.value
                ? options.find((option) => option.value === field.value)?.label
                : placeholder}
            </span>
            <ChevronDownIcon
              size={16}
              className="text-muted-foreground/80 shrink-0"
              aria-hidden="true"
            />
          </Button>
        </FormControl>
      </PopoverTrigger>
      <PopoverContent
        className="border-input w-full min-w-[var(--radix-popper-anchor-width)] p-0"
        align="start"
      >
        <Command>
          <CommandInput placeholder={searchPlaceholder} />
          <CommandList>
            <CommandEmpty>{emptyMessage}</CommandEmpty>
            <CommandGroup>
              {options.map((option) => (
                <CommandItem
                  key={option.value}
                  value={option.value}
                  onSelect={() => {
                    field.onChange(option.value);
                    setOpen(false);
                  }}
                >
                  {option.label}
                  <CheckIcon
                    size={16}
                    className={cn(
                      "ml-auto",
                      field.value === option.value ? "opacity-100" : "opacity-0"
                    )}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}

// "use client";

// import { cn } from "@/lib/utils";
// import { Button } from "@/components/ui/button";
// import {
//   Command,
//   CommandEmpty,
//   CommandGroup,
//   CommandInput,
//   CommandItem,
//   CommandList,
// } from "@/components/ui/command";
// import { Label } from "@/components/ui/label";
// import {
//   Popover,
//   PopoverContent,
//   PopoverTrigger,
// } from "@/components/ui/popover";
// import { CheckIcon, ChevronDownIcon } from "lucide-react";
// import { useId, useState } from "react";

// const frameworks = [
//   {
//     value: "next.js",
//     label: "Next.js",
//   },
//   {
//     value: "sveltekit",
//     label: "SvelteKit",
//   },
//   {
//     value: "nuxt.js",
//     label: "Nuxt.js",
//   },
//   {
//     value: "remix",
//     label: "Remix",
//   },
//   {
//     value: "astro",
//     label: "Astro",
//   },
//   {
//     value: "angular",
//     label: "Angular",
//   },
//   {
//     value: "vue",
//     label: "Vue.js",
//   },
//   {
//     value: "react",
//     label: "React",
//   },
//   {
//     value: "ember",
//     label: "Ember.js",
//   },
//   {
//     value: "gatsby",
//     label: "Gatsby",
//   },
//   {
//     value: "eleventy",
//     label: "Eleventy",
//   },
//   {
//     value: "solid",
//     label: "SolidJS",
//   },
//   {
//     value: "preact",
//     label: "Preact",
//   },
//   {
//     value: "qwik",
//     label: "Qwik",
//   },
//   {
//     value: "alpine",
//     label: "Alpine.js",
//   },
//   {
//     value: "lit",
//     label: "Lit",
//   },
// ];

// export default function SelectWithSearch() {
//   const id = useId();
//   const [open, setOpen] = useState<boolean>(false);
//   const [value, setValue] = useState<string>("");

//   return (
//     <div className="*:not-first:mt-2">
//       <Label htmlFor={id}>Select with search</Label>
//       <Popover open={open} onOpenChange={setOpen}>
//         <PopoverTrigger asChild>
//           <Button
//             id={id}
//             variant="outline"
//             role="combobox"
//             aria-expanded={open}
//             className="bg-background hover:bg-background border-input w-full justify-between px-3 font-normal outline-offset-0 outline-none focus-visible:outline-[3px]"
//           >
//             <span className={cn("truncate", !value && "text-muted-foreground")}>
//               {value
//                 ? frameworks.find((framework) => framework.value === value)
//                     ?.label
//                 : "Select framework"}
//             </span>
//             <ChevronDownIcon
//               size={16}
//               className="text-muted-foreground/80 shrink-0"
//               aria-hidden="true"
//             />
//           </Button>
//         </PopoverTrigger>
//         <PopoverContent
//           className="border-input w-full min-w-[var(--radix-popper-anchor-width)] p-0"
//           align="start"
//         >
//           <Command>
//             <CommandInput placeholder="Search framework..." />
//             <CommandList>
//               <CommandEmpty>No framework found.</CommandEmpty>
//               <CommandGroup>
//                 {frameworks.map((framework) => (
//                   <CommandItem
//                     key={framework.value}
//                     value={framework.value}
//                     onSelect={(currentValue) => {
//                       setValue(currentValue === value ? "" : currentValue);
//                       setOpen(false);
//                     }}
//                   >
//                     {framework.label}
//                     {value === framework.value && (
//                       <CheckIcon size={16} className="ml-auto" />
//                     )}
//                   </CommandItem>
//                 ))}
//               </CommandGroup>
//             </CommandList>
//           </Command>
//         </PopoverContent>
//       </Popover>
//     </div>
//   );
// }
