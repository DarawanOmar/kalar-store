import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { differenceInMonths, differenceInWeeks } from "date-fns";
import { unlinkImage } from "./helper";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
export const parseDateRange = (range: string) => {
  if (!range) {
    // Default: Start of the current month to end of the current month
    const now = new Date();
    const startDate = new Date(now.getFullYear(), now.getMonth(), 1); // First day of month
    const endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0); // Last day of month
    return { startDate, endDate };
  }

  const [start, end] = range.split("to");
  return {
    startDate: new Date(start.trim()),
    endDate: new Date(end.trim()),
  };
};

// Function to get the relative time description (last month, last 2 months, last week, etc.)
export const getTimeDescription = (startDate: Date): string => {
  const now = new Date();

  // Calculate the number of months and weeks between startDate and now
  const monthsDifference = differenceInMonths(now, startDate);
  const weeksDifference = differenceInWeeks(now, startDate);

  // If the range is in months
  if (monthsDifference >= 1) {
    if (monthsDifference === 1) {
      return "لە مانگی ڕابردوو"; // "Last month"
    } else {
      return `لە ${monthsDifference} مانگ ڕابردوو`; // "Last X months"
    }
  }

  // If the range is in weeks
  if (weeksDifference >= 1) {
    if (weeksDifference === 1) {
      return "لە هەفتەی ڕابردوو"; // "Last week"
    } else {
      return `لە ${weeksDifference} هەفتە ڕابردوو`; // "Last X weeks"
    }
  }

  return ""; // Return empty if the range is less than a week
};

export function getImageData(event: any) {
  const data = event as FileList | null;
  if (!data || !data[0]?.name) return { files: null, displayUrl: null };

  var binaryData = [];
  binaryData.push(data[0]);

  const dataTransfer = new DataTransfer();
  Array.from(data!).forEach((image) => dataTransfer.items.add(image));

  const displayUrl = URL.createObjectURL(
    new Blob(binaryData, { type: "application/zip" })
  );

  return { files: dataTransfer.files, displayUrl };
}

export async function uploadImageUsingHandler(
  file: File,
  updatePath?: string | null
) {
  const formData = new FormData();
  formData.append("image", file);

  if (updatePath) {
    await unlinkImage(updatePath);
  }

  const response = await fetch("/api/upload", {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    return {
      success: false,
      message: (await response?.json())?.error || "ڕەسمەکە خەزن نەبوو",
    };
  }

  return {
    success: true,
    path: (await response.json()).filePath,
  };
}
