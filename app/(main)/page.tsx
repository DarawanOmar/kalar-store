export const dynamic = "force-dynamic"; // Add this at the top of your Server Component
import React, { Suspense } from "react";
import FeedDashboard from "./feed-dashboard";
import SkeletonDashboard from "@/components/skeleton-dashboard";
type Props = {
  searchParams: searchParamsType;
};

async function DashboardPage({ searchParams }: Props) {
  return (
    <Suspense fallback={<SkeletonDashboard />}>
      <FeedDashboard />
    </Suspense>
  );
}

export default DashboardPage;
