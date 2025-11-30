export type ActivityStatsResponse = {
  status: {
    approved: number;
    pending: number;
    rejected: number;
    total: number;
  };
  type: Record<string, number>;
  trendingActivity: any;
};
