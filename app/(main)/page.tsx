import React, { Suspense } from "react";
import FeedDashboard from "./feed-dashboard";
import SkeletonDashboard from "@/components/skeleton-dashboard";

function DashboardPage() {
  return (
    <div>
      <Suspense fallback={<SkeletonDashboard />}>
        <FeedDashboard />
      </Suspense>
    </div>
  );
}

export default DashboardPage;
