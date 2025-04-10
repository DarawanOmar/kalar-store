"use client";
import { useState } from "react";
import { Button } from "./ui/button";
import { toast } from "sonner";
import { LuLoaderCircle } from "react-icons/lu";

type Props = {
  isLocal?: boolean;
};

export default function BackupButton({ isLocal }: Props) {
  const [isLoading, setIsLoading] = useState(false);

  const handleBackup = async () => {
    try {
      setIsLoading(true);
      const formData = new FormData();
      formData.append("uploadToDrive", isLocal ? "local" : "telegram");

      const response = await fetch("/api/backup", {
        method: "POST",
        body: formData,
      });
      const data = await response.json();
      if (response.ok) {
        isLocal
          ? toast.success("بەسەرکەوتووی کۆپیەک هەڵگیرا لە کۆمپتەرەکەوە")
          : toast.success("بە سەرکەوتووی کۆپیەک نێردرا بۆ تلیگرام");
      } else {
        toast.error(`Error: ${data.error || "Failed to backup database"}`);
      }
    } catch (error: any) {
      toast.error(`Error: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="backup-container">
      <Button onClick={handleBackup} disabled={isLoading} className="gap-2">
        {isLoading ? (
          <LuLoaderCircle className="animate-spin transition-all duration-500" />
        ) : null}
        {isLocal ? "باکئەپ بۆ کۆمپیتەر" : "باکئەپ بۆ تێلیگرام"}
      </Button>
    </div>
  );
}
