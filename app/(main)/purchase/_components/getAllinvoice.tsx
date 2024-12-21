import React from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Trash } from "lucide-react";

function GetAllinvoice() {
  return (
    <div className="flex items-center gap-3">
      <Button
        size={"icon"}
        variant={"outline"}
        className="rounded-md hover:bg-red-500 hover:text-white transition-all duration-500"
      >
        <Trash size={16} strokeWidth={2} />
      </Button>
      <Select>
        <SelectTrigger className="w-[120px]">
          <SelectValue placeholder="Theme" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="light">Light</SelectItem>
          <SelectItem value="dark">Dark</SelectItem>
          <SelectItem value="system">System</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}

export default GetAllinvoice;
