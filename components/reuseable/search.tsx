"use client";
import React from "react";
import { Input } from "../ui/input";
import { Search as SearchIcon } from "lucide-react";
import { useQueryState } from "nuqs";
import { cn } from "@/lib/utils";

type Props = {
  nameSearch?: string;
  className?: string;
  palceHolder?: string;
};

function Search({
  nameSearch = "search",
  className,
  palceHolder = "گەڕان...",
}: Props) {
  const [name, setName] = useQueryState(nameSearch, {
    clearOnDefault: true,
    defaultValue: "",
  });
  return (
    <div>
      <Input
        value={name}
        onChange={(e) => setName(e.target.value)}
        type="search"
        placeholder={palceHolder}
        Icon={SearchIcon}
        className={cn(
          "placeholder:font-normal placeholder:font-sirwan_reguler",
          className
        )}
        sizeIcon={20}
      />
    </div>
  );
}

export default Search;
