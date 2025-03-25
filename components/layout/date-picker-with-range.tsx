"use client";

import { useCallback, useEffect, useState } from "react";
import { format, parse } from "date-fns";
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
  defaultRange,
}: React.HTMLAttributes<HTMLDivElement> & {
  triggerClassName?: string;
  name?: string;
  defaultRange?: { startDate: Date; endDate: Date };
}) {
  const [dataQuery, setDataQuery] = useQueryState(name, {
    clearOnDefault: true,
    defaultValue: "",
    shallow: false,
  });

  // Parse searchParam value if available
  const parseRangeFromSearchParams = (
    range: string | undefined
  ): DateRange | undefined => {
    if (!range) return undefined;
    const [start, end] = range.split("to");
    return {
      from: parse(start.trim(), "MM-dd-yyyy", new Date()),
      to: parse(end.trim(), "MM-dd-yyyy", new Date()),
    };
  };

  // Initialize date state
  const [date, setDate] = useState<DateRange | undefined>(
    parseRangeFromSearchParams(dataQuery) || {
      from: defaultRange?.startDate,
      to: defaultRange?.endDate,
    }
  );

  // Update the state when searchParams change (on refresh)
  useEffect(() => {
    setDate(
      parseRangeFromSearchParams(dataQuery) || {
        from: defaultRange?.startDate,
        to: defaultRange?.endDate,
      }
    );
  }, [dataQuery, defaultRange]);

  const handleChangeDate = useCallback(
    (selectedDate: DateRange | undefined) => {
      setDate(selectedDate);
      if (!selectedDate?.from || !selectedDate?.to) return;
      setDataQuery(
        `${format(selectedDate.from, "MM-dd-yyyy")}to${format(
          selectedDate.to,
          "MM-dd-yyyy"
        )}`
      );
    },
    [setDataQuery]
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
                {format(defaultRange?.startDate || new Date(), "LLL dd, y")} -{" "}
                {format(defaultRange?.endDate || new Date(), "LLL dd, y")}
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
                  setDate({
                    from: defaultRange?.startDate,
                    to: defaultRange?.endDate,
                  });
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
