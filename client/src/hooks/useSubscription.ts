import { trpc } from "@/lib/trpc";

export type SubscriptionTier = "free" | "premium" | "vip";

export function useSubscription() {
  const { data, isLoading, refetch } = trpc.subscription.status.useQuery(undefined, {
    retry: false,
    refetchOnWindowFocus: true,
  });

  return {
    tier: (data?.tier || "free") as SubscriptionTier,
    isAuthenticated: data?.isAuthenticated ?? false,
    isLoading,
    isPremium: data?.tier === "premium" || data?.tier === "vip",
    isVip: data?.tier === "vip",
    refetch,
  };
}
