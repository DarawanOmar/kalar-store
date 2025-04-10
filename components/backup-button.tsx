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
      formData.append("uploadOption", isLocal ? "local" : "google-drive");

      const response = await fetch("/api/backup", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (response.ok) {
        if (isLocal) {
          toast.success("بەسەرکەوتووی کۆپیەک هەڵگیرا لە کۆمپتەرەکەوە");
        } else {
          toast.success("بەسەرکەوتووی کۆپیەک نێردرا بۆ گۆگڵ درایڤ");

          // If you want to show the Google Drive link
          if (data.fileUrl) {
            toast.info("لینکی فایل لە گۆگڵ درایڤ", {
              action: {
                label: "کردنەوەی لینک",
                onClick: () => window.open(data.fileUrl, "_blank"),
              },
            });
          }
        }
      } else {
        toast.error(
          `هەڵە: ${
            data.description || "هەڵەیەک هەیە لە کاتی باکئەپ کردنی داتابەیس"
          }`
        );
      }
    } catch (error: any) {
      toast.error(`هەڵە: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <Button
        onClick={handleBackup}
        disabled={isLoading}
        className="gap-2 w-full"
      >
        {isLoading ? (
          <LuLoaderCircle className="animate-spin transition-all duration-500" />
        ) : null}
        {isLocal ? "باکئەپ بۆ کۆمپیتەر" : "باکئەپ گۆگڵ درایڤ"}
      </Button>
    </div>
  );
}
