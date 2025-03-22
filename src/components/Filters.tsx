import { AnimatePresence, motion } from "framer-motion";
import { FilterOptions, SortOption, Skip } from "../types";
import { useState, useRef, useEffect } from "react";
import Portal from "./Portal";
import {
  ArrowRightIcon,
  SortIcon,
  FilterIcon,
  CrossIcon,
  CheckmarkIcon,
} from "./Icons";
type FiltersProps = {
  allSkips: Skip[];
  onFilteredSkipsChange: (filteredSkips: Skip[]) => void;
  initialFilters?: Partial<FilterOptions>;
};

const Filters = ({
  allSkips,
  onFilteredSkipsChange,
  initialFilters = {},
}: FiltersProps) => {
  // Internal state for filters
  const [filters, setFilters] = useState<FilterOptions>({
    sortOrder: "price-asc",
    priceRange: {
      min: 0,
      max: null,
    },
    roadAllowed: false,
    heavyWasteAllowed: false,
    ...initialFilters,
  });

  const [showFilters, setShowFilters] = useState(false);
  const [showSortPanel, setShowSortPanel] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);

  // Apply filters and sorting whenever filters or skips change
  useEffect(() => {
    const applyFilters = () => {
      // Filter skips based on criteria
      const filteredSkips = allSkips.filter((skip) => {
        if (filters.roadAllowed && !skip.allowed_on_road) return false;
        if (filters.heavyWasteAllowed && !skip.allows_heavy_waste) return false;

        // Price filtering
        const skipPrice = calculateTotalPrice(skip);
        if (filters.priceRange.min > 0 && skipPrice < filters.priceRange.min)
          return false;
        if (
          filters.priceRange.max !== null &&
          skipPrice > filters.priceRange.max
        )
          return false;

        return true;
      });

      // Sort the filtered skips
      const sortedSkips = [...filteredSkips].sort((a, b) => {
        // Always prioritize available skips
        if (a.allows_heavy_waste && !b.allows_heavy_waste) return -1;
        if (!a.allows_heavy_waste && b.allows_heavy_waste) return 1;

        // Then apply the selected sort order
        switch (filters.sortOrder) {
          case "price-asc":
            return calculateTotalPrice(a) - calculateTotalPrice(b);
          case "price-desc":
            return calculateTotalPrice(b) - calculateTotalPrice(a);
          case "size-asc":
            return a.size - b.size;
          case "size-desc":
            return b.size - a.size;
          default:
            return 0;
        }
      });

      // Notify parent component about the filtered skips
      onFilteredSkipsChange(sortedSkips);
    };

    applyFilters();
  }, [filters, allSkips, onFilteredSkipsChange]);

  // Calculate total price for a skip (including VAT)
  const calculateTotalPrice = (skip: Skip): number => {
    const priceBeforeVat = skip.price_before_vat;
    const vatMultiplier = 1 + skip.vat / 100;
    return Math.round(priceBeforeVat * vatMultiplier);
  };

  // Toggle panels
  const toggleFilters = () => {
    setShowFilters((prev) => !prev);
    if (showSortPanel) setShowSortPanel(false);
  };

  const toggleSortPanel = () => {
    setShowSortPanel((prev) => !prev);
    if (showFilters) setShowFilters(false);
  };

  const closeAllPanels = () => {
    setShowFilters(false);
    setShowSortPanel(false);
  };

  // Handle filter updates
  const updateFilter = (
    filterName: "sortOrder" | "roadAllowed" | "heavyWasteAllowed",
    value: boolean | string
  ) => {
    setFilters((prev) => ({
      ...prev,
      [filterName]: value,
    }));
  };

  const updatePriceRange = (type: "min" | "max", value: string) => {
    setFilters((prev) => ({
      ...prev,
      priceRange: {
        ...prev.priceRange,
        [type]: value === "" ? (type === "min" ? 0 : null) : Number(value),
      },
    }));
  };

  // Clear all filters
  const clearAllFilters = () => {
    setFilters({
      sortOrder: "price-asc",
      priceRange: { min: 0, max: null },
      roadAllowed: false,
      heavyWasteAllowed: false,
    });
  };

  // Get current sort method display text
  const getSortOrderText = () => {
    const sortLabels: Record<string, string> = {
      "price-asc": "Price (low to high)",
      "price-desc": "Price (high to low)",
      "size-asc": "Size (small to large)",
      "size-desc": "Size (large to small)",
    };

    // Type assertion to avoid the type error
    return (
      sortLabels[filters.sortOrder as keyof typeof sortLabels] ||
      sortLabels["price-asc"]
    );
  };

  // Sort options data
  const sortOptions: SortOption[] = [
    {
      order: "price-asc",
      label: "Price: Low to High",
      icon: {
        viewBox: "0 0 24 24",
        path: "M3 4h13v2H3V4zm0 6h10v2H3v-2zm0 6h13v2H3v-2zM19 20h2V4h-2v16z",
      },
    },
    {
      order: "price-desc",
      label: "Price: High to Low",
      icon: {
        viewBox: "0 0 24 24",
        path: "M3 4h13v2H3V4zm0 6h10v2H3v-2zm0 6h13v2H3v-2zM19 4h2v16h-2V4z",
      },
    },
    {
      order: "size-asc",
      label: "Size: Small to Large",
      icon: {
        viewBox: "0 0 24 24",
        path: "M7.41,15.41L12,10.83L16.59,15.41L18,14L12,8L6,14L7.41,15.41Z",
      },
    },
    {
      order: "size-desc",
      label: "Size: Large to Small",
      icon: {
        viewBox: "0 0 24 24",
        path: "M7.41,8.58L12,13.17L16.59,8.58L18,10L12,16L6,10L7.41,8.58Z",
      },
    },
  ];

  // Count active filters
  const activeFilterCount =
    Number(filters.roadAllowed) +
    Number(filters.heavyWasteAllowed) +
    Number(filters.priceRange.min > 0 || filters.priceRange.max !== null);

  // Lock/unlock body scroll when the fullscreen filter is open
  useEffect(() => {
    if (showFilters) {
      // Only lock scroll on mobile screens
      const shouldLockScroll = window.matchMedia("(max-width: 767px)").matches;

      if (shouldLockScroll) {
        document.body.style.overflow = "hidden";
      }
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [showFilters]);

  // Focus management for accessibility
  useEffect(() => {
    if (showFilters && modalRef.current) {
      const activeElement = document.activeElement;

      modalRef.current.focus();

      return () => {
        if (activeElement instanceof HTMLElement) {
          activeElement.focus();
        }
      };
    }
  }, [showFilters]);

  // Return available skips count
  const getAvailableSkipsCount = () => {
    return allSkips.filter((skip) => skip.allows_heavy_waste).length;
  };

  return (
    <div className="flex items-center justify-between gap-3 w-full">
      {/* Available skips count */}
      <div className="text-sm text-gray-500">
        {getAvailableSkipsCount()} of {allSkips.length} skips available
      </div>

      <div className="flex items-center gap-3 relative">
        {/* Desktop Sort Button */}
        <button
          onClick={toggleSortPanel}
          className={`
            relative hidden md:flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-md
            ${
              showSortPanel
                ? "bg-green-50 text-green-600 outline outline-green-500"
                : "bg-white text-gray-600 outline outline-gray-200"
            }
          `}
        >
          <SortIcon className="w-4 h-4" />
          {getSortOrderText()}
          <ArrowRightIcon
            className={`w-4 h-4 transition-transform duration-200 ${
              showSortPanel ? "rotate-270" : "rotate-90"
            }`}
          />
        </button>

        {/* Filter Button */}
        <button
          onClick={toggleFilters}
          className={`
            relative flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-md
            ${
              showFilters
                ? "bg-green-50 text-green-600 outline outline-green-500"
                : "bg-white text-gray-600 outline outline-gray-200"
            }
          `}
        >
          <FilterIcon className="w-4 h-4" />

          <span className="hidden md:inline">Filters</span>

          {activeFilterCount > 0 && (
            <span className="absolute top-0 right-0 -mt-1 -mr-1 flex h-4 w-4 items-center justify-center rounded-full bg-green-500 text-xs text-white">
              {activeFilterCount}
            </span>
          )}
        </button>

        {/* Desktop Sort Panel */}
        <AnimatePresence>
          {showSortPanel && (
            <motion.div
              className="absolute right-0 top-full mt-2 z-10 bg-white rounded-lg shadow-lg border border-gray-100 p-4 w-full hidden md:block"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              <div className="flex flex-col space-y-3">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="font-medium text-gray-700">Sort Options</h3>
                  <button
                    onClick={toggleSortPanel}
                    className="text-gray-400 hover:text-gray-500"
                  >
                    <CrossIcon className="w-4 h-4" />
                  </button>
                </div>

                {sortOptions.map(({ order, label, icon }) => (
                  <button
                    key={order}
                    onClick={() => {
                      updateFilter("sortOrder", order);
                      setShowSortPanel(false);
                    }}
                    className={`flex items-center justify-between p-2 rounded-md text-sm ${
                      filters.sortOrder === order
                        ? "bg-green-50 text-green-700 border border-green-200"
                        : "bg-gray-50 hover:bg-gray-100 text-gray-700"
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <svg
                        className="w-5 h-5"
                        viewBox={icon.viewBox}
                        fill="currentColor"
                      >
                        <path d={icon.path} />
                      </svg>
                      {label}
                    </div>
                    {filters.sortOrder === order && (
                      <CheckmarkIcon className="w-5 h-5" />
                    )}
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Responsive Filter Panel */}
        <AnimatePresence>
          {showFilters && (
            <>
              {/* Mobile overlay */}
              <Portal wrapperId="filters-overlay">
                <motion.div
                  className="fixed inset-0 bg-black bg-opacity-30 z-50 pointer-events-auto md:hidden"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onClick={closeAllPanels}
                />
              </Portal>

              {/* Filter Modal - Mobile (full screen) */}
              <Portal wrapperId="filters-modal">
                <motion.div
                  ref={modalRef}
                  tabIndex={-1}
                  className="fixed inset-y-0 right-0 w-full md:hidden bg-white z-50 p-4 overflow-y-auto pointer-events-auto"
                  initial={{ x: "100%", opacity: 1, y: 0 }}
                  animate={{ x: 0, opacity: 1, y: 0 }}
                  exit={{ x: "100%", opacity: 0, y: 0 }}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                  style={{
                    maxHeight:
                      "calc(100vh - env(safe-area-inset-top) - env(safe-area-inset-bottom))",
                  }}
                >
                  {/* Mobile Filter Header */}
                  <div className="flex justify-between items-center border-b border-gray-100 pb-3 mb-4">
                    <h2 className="text-lg font-semibold text-gray-800">
                      Filters
                    </h2>
                    <button
                      onClick={closeAllPanels}
                      className="p-1 rounded-full hover:bg-gray-100 text-gray-500"
                    >
                      <CrossIcon className="w-6 h-6" />
                    </button>
                  </div>

                  {/* Sort options for mobile */}
                  <div className="mb-6">
                    <h3 className="text-sm font-medium text-gray-700 mb-3">
                      Sort By
                    </h3>
                    <div className="grid grid-cols-1 gap-2">
                      {sortOptions.map(({ order, label, icon }) => (
                        <button
                          key={order}
                          onClick={() => {
                            updateFilter("sortOrder", order);
                          }}
                          className={`flex items-center justify-between p-3 rounded-md text-sm ${
                            filters.sortOrder === order
                              ? "bg-green-50 text-green-700 border border-green-200"
                              : "bg-gray-50 hover:bg-gray-100 text-gray-700"
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            <svg
                              className="w-5 h-5"
                              viewBox={icon.viewBox}
                              fill="currentColor"
                            >
                              <path d={icon.path} />
                            </svg>
                            {label}
                          </div>
                          {filters.sortOrder === order && (
                            <CheckmarkIcon className="w-5 h-5" />
                          )}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Mobile price range */}
                  <div className="mb-6">
                    <h3 className="text-sm font-medium text-gray-700 mb-3">
                      Price Range
                    </h3>
                    <div className="bg-gray-50 p-3 rounded-md">
                      <div className="flex justify-between gap-2">
                        <label className="block text-xs text-gray-500 mb-1">
                          Min Price
                        </label>
                        <label className="block text-xs text-gray-500 mb-1">
                          Max Price
                        </label>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="relative flex-1">
                          <span className="absolute inset-y-0 left-0 flex items-center pl-2 text-gray-500">
                            £
                          </span>
                          <input
                            type="number"
                            min="0"
                            value={
                              filters.priceRange.min === 0
                                ? ""
                                : filters.priceRange.min
                            }
                            onChange={(e) =>
                              updatePriceRange("min", e.target.value)
                            }
                            placeholder="Min"
                            className="w-full pl-6 pr-2 py-2 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-green-500 focus:border-green-500"
                          />
                        </div>

                        <span className="text-gray-400">to</span>

                        <div className="relative flex-1">
                          <span className="absolute inset-y-0 left-0 flex items-center pl-2 text-gray-500">
                            £
                          </span>
                          <input
                            type="number"
                            min="0"
                            value={
                              filters.priceRange.max === null
                                ? ""
                                : filters.priceRange.max
                            }
                            onChange={(e) =>
                              updatePriceRange("max", e.target.value)
                            }
                            placeholder="Max"
                            className="w-full pl-6 pr-2 py-2 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-green-500 focus:border-green-500"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Mobile features */}
                  <div className="mb-6">
                    <h3 className="text-sm font-medium text-gray-700 mb-3">
                      Features
                    </h3>
                    <div className="space-y-2">
                      <button
                        onClick={() =>
                          updateFilter("roadAllowed", !filters.roadAllowed)
                        }
                        className={`
                          flex items-center gap-2 px-3 py-3 rounded-md text-sm font-medium transition-colors w-full
                          ${
                            filters.roadAllowed
                              ? "bg-green-100 text-green-700"
                              : "bg-gray-50 text-gray-600 hover:bg-gray-100"
                          }
                        `}
                      >
                        <span
                          className={`w-5 h-5 rounded flex items-center justify-center ${
                            filters.roadAllowed
                              ? "bg-green-500 text-white"
                              : "border border-gray-300"
                          }`}
                        >
                          {filters.roadAllowed && (
                            <CheckmarkIcon className="w-3 h-3" />
                          )}
                        </span>
                        Road placement
                      </button>

                      <button
                        onClick={() =>
                          updateFilter(
                            "heavyWasteAllowed",
                            !filters.heavyWasteAllowed
                          )
                        }
                        className={`
                          flex items-center gap-2 px-3 py-3 rounded-md text-sm font-medium transition-colors w-full
                          ${
                            filters.heavyWasteAllowed
                              ? "bg-green-100 text-green-700"
                              : "bg-gray-50 text-gray-600 hover:bg-gray-100"
                          }
                        `}
                      >
                        <span
                          className={`w-5 h-5 rounded flex items-center justify-center ${
                            filters.heavyWasteAllowed
                              ? "bg-green-500 text-white"
                              : "border border-gray-300"
                          }`}
                        >
                          {filters.heavyWasteAllowed && (
                            <CheckmarkIcon className="w-3 h-3" />
                          )}
                        </span>
                        Heavy waste
                      </button>
                    </div>
                  </div>

                  {/* Mobile action buttons */}
                  <div className="pt-4 border-t border-gray-200 mt-auto">
                    <div className="flex gap-3">
                      {activeFilterCount > 0 && (
                        <button
                          onClick={clearAllFilters}
                          className="flex-1 py-3 px-4 border border-gray-300 rounded-md text-gray-600 text-sm font-medium"
                        >
                          Clear all
                        </button>
                      )}
                      <button
                        onClick={closeAllPanels}
                        className="flex-1 py-3 px-4 bg-green-600 rounded-md text-white text-sm font-medium"
                      >
                        Apply
                      </button>
                    </div>
                  </div>
                </motion.div>
              </Portal>

              {/* Desktop Filter Panel (dropdown style) */}
              <motion.div
                className="absolute right-0 top-full mt-2 z-10 bg-white rounded-lg shadow-lg border border-gray-100 p-4 w-80 hidden md:block"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
              >
                <div className="flex flex-col space-y-3">
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="font-medium text-gray-700">
                      Filter Options
                    </h3>
                    <button
                      onClick={closeAllPanels}
                      className="text-gray-400 hover:text-gray-500"
                    >
                      <CrossIcon className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Price Range Filter */}
                  <div>
                    <h4 className="text-sm font-medium text-gray-700 mb-3">
                      Price Range
                    </h4>
                    <div className="bg-gray-50 p-3 rounded-md">
                      <div className="flex justify-between gap-2">
                        <label className="block text-xs text-gray-500 mb-1">
                          Min Price
                        </label>
                        <label className="block text-xs text-gray-500 mb-1">
                          Max Price
                        </label>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="relative flex-1">
                          <span className="absolute inset-y-0 left-0 flex items-center pl-2 text-gray-500">
                            £
                          </span>
                          <input
                            type="number"
                            min="0"
                            value={
                              filters.priceRange.min === 0
                                ? ""
                                : filters.priceRange.min
                            }
                            onChange={(e) =>
                              updatePriceRange("min", e.target.value)
                            }
                            placeholder="Min"
                            className="w-full pl-6 pr-2 py-1.5 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-green-500 focus:border-green-500"
                          />
                        </div>

                        <span className="text-gray-400">to</span>

                        <div className="relative flex-1">
                          <span className="absolute inset-y-0 left-0 flex items-center pl-2 text-gray-500">
                            £
                          </span>
                          <input
                            type="number"
                            min="0"
                            value={
                              filters.priceRange.max === null
                                ? ""
                                : filters.priceRange.max
                            }
                            onChange={(e) =>
                              updatePriceRange("max", e.target.value)
                            }
                            placeholder="Max"
                            className="w-full pl-6 pr-2 py-1.5 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-green-500 focus:border-green-500"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Feature Filters */}
                  <div className="space-y-3">
                    <h4 className="text-sm font-medium text-gray-700 mb-3">
                      Features
                    </h4>

                    <div className="flex items-center">
                      <button
                        onClick={() =>
                          updateFilter("roadAllowed", !filters.roadAllowed)
                        }
                        className={`
                        flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors w-full
                        ${
                          filters.roadAllowed
                            ? "bg-green-100 text-green-700"
                            : "bg-gray-50 text-gray-600 hover:bg-gray-100"
                        }
                      `}
                      >
                        <span
                          className={`w-5 h-5 rounded flex items-center justify-center ${
                            filters.roadAllowed
                              ? "bg-green-500 text-white"
                              : "border border-gray-300"
                          }`}
                        >
                          {filters.roadAllowed && (
                            <CheckmarkIcon className="w-3 h-3" />
                          )}
                        </span>
                        Road placement
                      </button>
                    </div>

                    <div className="flex items-center">
                      <button
                        onClick={() =>
                          updateFilter(
                            "heavyWasteAllowed",
                            !filters.heavyWasteAllowed
                          )
                        }
                        className={`
                        flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors w-full
                        ${
                          filters.heavyWasteAllowed
                            ? "bg-green-100 text-green-700"
                            : "bg-gray-50 text-gray-600 hover:bg-gray-100"
                        }
                      `}
                      >
                        <span
                          className={`w-5 h-5 rounded flex items-center justify-center ${
                            filters.heavyWasteAllowed
                              ? "bg-green-500 text-white"
                              : "border border-gray-300"
                          }`}
                        >
                          {filters.heavyWasteAllowed && (
                            <CheckmarkIcon className="w-3 h-3" />
                          )}
                        </span>
                        Heavy waste
                      </button>
                    </div>
                  </div>

                  {/* Action buttons for desktop */}
                  {activeFilterCount > 0 && (
                    <div className="pt-4 border-t border-gray-200 mt-auto">
                      <button
                        onClick={clearAllFilters}
                        className="text-sm flex items-center justify-center text-red-500 hover:underline"
                      >
                        <CrossIcon className="w-4 h-4 mr-1" />
                        Clear all filters
                      </button>
                    </div>
                  )}
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Filters;
