export type ActivityStatsResponse = {
  status: {
    approved: number;
    pending: number;
    rejected: number;
    total: number;
  };
  types: Record<string, number>;
  trendingActivityType: any;
};

export interface ActivityAggregationResult {
  statusStats: { _id: string; count: number }[];
  typeStats: { _id: string; count: number }[];
  trendingType: { _id: string; count: number }[];
}

export interface DateRange {
  $gte?: Date;
  $lte?: Date;
}
