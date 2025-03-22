
type Skip = {
    id: number;
    size: number;
    hire_period_days: number;
    transport_cost: number | null;
    per_tonne_cost: number | null;
    price_before_vat: number;
    vat: number;
    postcode: string;
    area: string | null;
    forbidden: boolean;
    created_at: string;
    updated_at: string;
    allowed_on_road: boolean;
    allows_heavy_waste: boolean;
  };

  type SortOption = {
    order: string;
    label: string;
    icon: {
      viewBox: string;
      path: string;
    };
  };
  
  type ProgressStep = {
    id: string;
    label: string;
    icon: React.ReactNode;
    completed: boolean;
    active: boolean;
  };

  type SortOrder = "price-asc" | "price-desc" | "size-asc" | "size-desc";

  type FilterOptions = {
    sortOrder: SortOrder;
    priceRange: {
      min: number;
      max: number | null;
    };
    roadAllowed: boolean;
    heavyWasteAllowed: boolean;
  };
  

  export type { Skip, ProgressStep, SortOption, FilterOptions };