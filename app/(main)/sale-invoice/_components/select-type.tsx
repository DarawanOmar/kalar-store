"use client";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useQueryState } from "nuqs";

import React from "react";

function SelectType() {
  const [type, setType] = useQueryState("type", {
    defaultValue: "",
    shallow: false,
  });

  return (
    <Select
      value={type}
      onValueChange={(value) => {
        if (value === "all") {
          setType("");
          return;
        }
        setType(value);
      }}
    >
      <SelectTrigger className="w-auto min-w[100px] ">
        <SelectValue placeholder="پسووڵە" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="all">هەموو</SelectItem>
        <SelectItem value="loan">قەرز</SelectItem>
        <SelectItem value="cash">کاش</SelectItem>
      </SelectContent>
    </Select>
  );
}

export default SelectType;
