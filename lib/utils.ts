import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

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
