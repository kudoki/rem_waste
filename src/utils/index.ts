import { Skip } from "../types";

export const calculateTotalPrice = (skip: Skip): number => {
  let total = skip.price_before_vat;
  
  // Add transport cost if available
  if (skip.transport_cost !== null) {
    total += skip.transport_cost;
  }
  
  // Calculate VAT
  const vatAmount = total * (skip.vat / 100);
  
  // Return the total price with VAT rounded to the nearest integer
  return Math.round(total + vatAmount);
};
