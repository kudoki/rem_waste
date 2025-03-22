import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import "./styles/scrollbar.css";
import { Skip } from "./types";
import ProgressBar from "./components/ProgressBar";
import { calculateTotalPrice } from "./utils";
import SkipCard from "./components/Card";
import Filters from "./components/Filters";
import SkipDetailsModal from "./components/SkipDetailsModal";
import { SearchIcon, CheckmarkIcon, ArrowRightIcon } from "./components/Icons";

function App() {
  const [skips, setSkips] = useState<Skip[]>([]);
  const [filteredSkips, setFilteredSkips] = useState<Skip[]>([]);
  const [selectedSkipId, setSelectedSkipId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedSkipForModal, setSelectedSkipForModal] = useState<Skip | null>(
    null
  );

  const fetchedRef = useRef(false);

  useEffect(() => {
    const fetchSkips = async () => {
      if (fetchedRef.current) return;

      fetchedRef.current = true;

      try {
        // Option 1: Use the API endpoint
        const response = await fetch(
          "https://app.wewantwaste.co.uk/api/skips/by-location?postcode=NR32&area=Lowestoft"
        );
        if (!response.ok) {
          throw new Error("Failed to fetch skips");
        }
        const skipData = await response.json();

        // Option 2: Use mock data for development/testing
        /*   const skipData = [
          {
            id: 11554,
            size: 4,
            hire_period_days: 14,
            transport_cost: null,
            per_tonne_cost: null,
            price_before_vat: 311,
            vat: 20,
            postcode: "NR32",
            area: null,
            forbidden: false,
            created_at: "2021-04-06T17:04:42",
            updated_at: "2024-04-02T09:22:38",
            allowed_on_road: true,
            allows_heavy_waste: true,
          },
          {
            id: 11555,
            size: 6,
            hire_period_days: 14,
            transport_cost: null,
            per_tonne_cost: null,
            price_before_vat: 342,
            vat: 20,
            postcode: "NR32",
            area: null,
            forbidden: false,
            created_at: "2021-04-06T17:04:42",
            updated_at: "2024-04-02T09:22:38",
            allowed_on_road: true,
            allows_heavy_waste: true,
          },
          {
            id: 11556,
            size: 8,
            hire_period_days: 14,
            transport_cost: null,
            per_tonne_cost: null,
            price_before_vat: 420,
            vat: 20,
            postcode: "NR32",
            area: null,
            forbidden: false,
            created_at: "2021-04-06T17:04:42",
            updated_at: "2024-04-02T09:22:38",
            allowed_on_road: true,
            allows_heavy_waste: true,
          },
          {
            id: 11557,
            size: 10,
            hire_period_days: 14,
            transport_cost: null,
            per_tonne_cost: null,
            price_before_vat: 448,
            vat: 20,
            postcode: "NR32",
            area: null,
            forbidden: false,
            created_at: "2021-04-06T17:04:42",
            updated_at: "2024-04-02T09:22:38",
            allowed_on_road: false,
            allows_heavy_waste: false,
          },
          {
            id: 11558,
            size: 12,
            hire_period_days: 14,
            transport_cost: null,
            per_tonne_cost: null,
            price_before_vat: 491,
            vat: 20,
            postcode: "NR32",
            area: null,
            forbidden: false,
            created_at: "2021-04-06T17:04:42",
            updated_at: "2024-04-02T09:22:38",
            allowed_on_road: false,
            allows_heavy_waste: false,
          },
          {
            id: 11559,
            size: 14,
            hire_period_days: 14,
            transport_cost: null,
            per_tonne_cost: null,
            price_before_vat: 527,
            vat: 20,
            postcode: "NR32",
            area: null,
            forbidden: false,
            created_at: "2021-04-06T17:04:42",
            updated_at: "2024-04-02T09:22:38",
            allowed_on_road: false,
            allows_heavy_waste: false,
          },
          {
            id: 11560,
            size: 16,
            hire_period_days: 14,
            transport_cost: null,
            per_tonne_cost: null,
            price_before_vat: 556,
            vat: 20,
            postcode: "NR32",
            area: null,
            forbidden: false,
            created_at: "2021-04-06T17:04:42",
            updated_at: "2024-04-02T09:22:38",
            allowed_on_road: false,
            allows_heavy_waste: false,
          },
          {
            id: 11561,
            size: 20,
            hire_period_days: 14,
            transport_cost: 236,
            per_tonne_cost: 236,
            price_before_vat: 944,
            vat: 20,
            postcode: "NR32",
            area: null,
            forbidden: false,
            created_at: "2021-04-06T17:04:42",
            updated_at: "2024-04-02T09:22:38",
            allowed_on_road: false,
            allows_heavy_waste: true,
          },
          {
            id: 11562,
            size: 40,
            hire_period_days: 14,
            transport_cost: 236,
            per_tonne_cost: 236,
            price_before_vat: 944,
            vat: 20,
            postcode: "NR32",
            area: null,
            forbidden: false,
            created_at: "2021-04-06T17:04:42",
            updated_at: "2024-04-02T09:22:38",
            allowed_on_road: false,
            allows_heavy_waste: false,
          },
        ]; */

        setSkips(skipData);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching skips:", error);
        setLoading(false);
      }
    };

    fetchSkips();
  }, []);

  const handleFilteredSkipsChange = (newFilteredSkips: Skip[]) => {
    setFilteredSkips(newFilteredSkips);
  };

  const handleContinue = () => {
    if (selectedSkipId) {
      const selectedSkip = skips.find((skip) => skip.id === selectedSkipId);
      if (selectedSkip) {
        setSelectedSkipForModal(selectedSkip);
        setModalOpen(true);
      }
    }
  };

  const handleViewSkipDetails = (skip: Skip) => {
    setSelectedSkipForModal(skip);
    setModalOpen(true);
  };

  const handleConfirmSkipSelection = () => {
    if (selectedSkipForModal) {
      setSelectedSkipId(selectedSkipForModal.id);
    }
    setModalOpen(false);
  };

  const getSelectedSkip = (): Skip | undefined => {
    return skips.find((skip) => skip.id === selectedSkipId);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="text-center">
          <div className="w-16 h-16 border-t-4 border-b-4 border-green-500 rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-xl text-gray-700">Loading skip options...</p>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`min-h-screen overflow-hidden relative custom-scrollbar ${
        selectedSkipId ? "selection-active" : ""
      }`}
    >
      <ProgressBar />

      {/* Main Content */}
      <div className="container mx-auto px-4 relative z-10 py-8 bg-white">
        <div className="max-w-5xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-bold text-center mb-3 text-gray-800">
            Choose Your Skip Size
          </h1>
          <p className="text-center text-gray-600">
            Select the skip size that best suits your waste disposal needs
          </p>

          {/* Filter & Sort toolbar - now self-contained */}
          <div className="flex mt-8 mb-6 relative">
            <Filters
              allSkips={skips}
              onFilteredSkipsChange={handleFilteredSkipsChange}
            />
          </div>

          {/* Skip listing */}
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8 custom-scrollbar"
            initial="hidden"
            animate="visible"
            variants={{
              visible: {
                transition: {
                  staggerChildren: 0.1,
                },
              },
            }}
          >
            {filteredSkips.length > 0 ? (
              filteredSkips.map((skip) => (
                <SkipCard
                  key={skip.id}
                  skip={skip}
                  selectedSkipId={selectedSkipId}
                  setSelectedSkipId={setSelectedSkipId}
                  onViewDetails={handleViewSkipDetails}
                />
              ))
            ) : (
              <motion.div className="col-span-full text-center py-16">
                {/* No results message */}
                <SearchIcon className="w-16 h-16 mx-auto text-gray-300 mb-4" />
                <h3 className="text-xl font-semibold text-gray-700 mb-2">
                  No matching skips found
                </h3>
                <p className="text-gray-500 max-w-md mx-auto">
                  No skips match your current filter criteria. Try adjusting
                  your filters to see available options.
                </p>
              </motion.div>
            )}
          </motion.div>
        </div>
      </div>

      {/* Skip Details Modal */}
      <SkipDetailsModal
        skip={selectedSkipForModal}
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onConfirm={handleConfirmSkipSelection}
      />

      {selectedSkipId && (
        <motion.div
          className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg z-10"
          initial={{ y: 100 }}
          animate={{ y: 0 }}
          exit={{ y: 100 }}
          transition={{ type: "spring", damping: 20 }}
        >
          <div className="container mx-auto px-4 py-3">
            <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-0">
              {/* Selected Skip Info */}
              <div className="flex items-center space-x-4 w-full sm:w-auto">
                <div className="h-10 sm:h-12 aspect-video relative rounded-lg overflow-hidden border border-gray-200">
                  <img
                    src="https://images.unsplash.com/photo-1590496793929-36417d3117de?q=80&w=800"
                    alt="Selected skip"
                    className="h-full w-full object-cover"
                  />
                </div>

                <div>
                  <h3 className="font-medium text-gray-900 text-sm sm:text-base">
                    {getSelectedSkip()?.size} Yard Skip
                  </h3>
                  <div className="flex items-center text-xs sm:text-sm text-gray-500 space-x-2 sm:space-x-3">
                    <span>{getSelectedSkip()?.hire_period_days} days</span>

                    {getSelectedSkip()?.allowed_on_road && (
                      <span className="flex items-center text-green-600">
                        <CheckmarkIcon className="w-3 h-3 mr-1" />
                        <span>Road</span>
                      </span>
                    )}

                    {getSelectedSkip()?.allows_heavy_waste && (
                      <span className="flex items-center text-green-600">
                        <CheckmarkIcon className="w-3 h-3 mr-1" />
                        <span>Heavy</span>
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Price and Actions */}
              <div className="flex items-center justify-between w-full sm:w-auto sm:space-x-4">
                <div className="text-left sm:text-right block">
                  <div className="text-base sm:text-lg font-bold text-green-600">
                    £{calculateTotalPrice(getSelectedSkip()!)}
                  </div>
                  <div className="text-xs text-gray-500">VAT included</div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setSelectedSkipId(null)}
                    className="px-2 sm:px-3 py-1.5 sm:py-2 border border-gray-300 rounded-full text-gray-600 hover:bg-gray-50 text-xs sm:text-sm"
                  >
                    Clear
                  </button>

                  <button
                    onClick={handleContinue}
                    className="px-3 sm:px-4 py-1.5 sm:py-2 bg-green-600 text-white rounded-full hover:bg-green-700 text-xs sm:text-sm flex items-center"
                  >
                    Continue
                    <ArrowRightIcon className="w-3 h-3 ml-1" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}

export default App;
