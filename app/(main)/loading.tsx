import { Button } from "@/components/ui/button";
import { LucideLoader2 } from "lucide-react";
import Link from "next/link";

export default function Loading() {
  return (
    <div className="flex justify-center items-center h-screen">
      <div className="flex gap-2 items-center">
        <div>
          <Button asChild variant={"linkHover1"} className="text-base">
            <Link
              href="https://wa.me/9647512813327"
              target="_blank"
              rel="noopener noreferrer"
              className="text-base"
            >
              Darawa Omar
            </Link>
          </Button>
          Developed By
        </div>
        <LucideLoader2 className="animate-spin  duration-500" />
      </div>
    </div>
  );
}
