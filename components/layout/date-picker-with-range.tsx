"use client";

import { useCallback, useState } from "react";
import { addDays, format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { DateRange } from "react-day-picker";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useQueryState } from "nuqs";

export function DatePickerWithRange({
  name = "range",
  className,
  triggerClassName,
}: React.HTMLAttributes<HTMLDivElement> & {
  triggerClassName?: string;
  name?: string;
}) {
  const [dataQuery, setDataQuery] = useQueryState(name, {
    clearOnDefault: true,
    defaultValue: "",
  });
  const now = new Date();
  const [date, setDate] = useState<DateRange | undefined>({
    from: new Date(2024, now.getMonth(), 1),
    to: addDays(now, 20),
  });

  const handleChangeDate = useCallback(
    (date: DateRange | undefined) => {
      setDate(date);
      if (!date?.from || !date?.to) return;
      setDataQuery(
        `${format(date.from, "MM-dd-yyyy")}to${format(date.to, "MM-dd-yyyy")}`
      );
    },
    [name]
  );

  return (
    <div className={cn("grid gap-2", className)}>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant={"outline"}
            className={cn(
              "flex justify-between items-center font-normal max-w-max max-sm:gap-2 gap-4",
              !date && "text-muted-foreground",
              triggerClassName
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {date?.from ? (
              date.to ? (
                <>
                  {format(date.from, "LLL dd, y")} -{" "}
                  {format(date.to, "LLL dd, y")}
                </>
              ) : (
                format(date.from, "LLL dd, y")
              )
            ) : (
              <span>
                {format(new Date(), "LLL dd, y")} -{" "}
                {format(new Date(), "LLL dd, y")}
              </span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent
          className="w-auto p-0 mx-4 dark:border-white/10"
          align="start"
          dir="ltr"
        >
          <Calendar
            initialFocus
            mode="range"
            defaultMonth={date?.from}
            selected={date}
            onSelect={handleChangeDate}
            numberOfMonths={1}
            footer={
              <Button
                className="w-full font-sirwan_reguler font-thin my-3 px-3"
                onClick={() => {
                  setDataQuery("");
                  setDate(undefined);
                }}
              >
                سڕینەوەی گەڕان
              </Button>
            }
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}
