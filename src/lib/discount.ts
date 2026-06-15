export const DISCOUNT_TIERS = [500, 1000, 1500, 2000, 2500, 3000, 5000] as const;

export function getDiscount(distanceKm: number): number {
  const km = Math.floor(distanceKm);
  let discount = 0;

  for (const tier of DISCOUNT_TIERS) {
    if (km >= tier) {
      discount = tier;
    }
  }

  return discount;
}