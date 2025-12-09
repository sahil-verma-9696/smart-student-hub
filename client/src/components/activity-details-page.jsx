import { useActivityDetailPageContext } from "@/contexts/activity-context";
import React from "react";

export default function ActivityDetailPage() {
  const { activity } = useActivityDetailPageContext();

  if (!activity) return null;

  return <div>ActivityDetailPage</div>;
}
