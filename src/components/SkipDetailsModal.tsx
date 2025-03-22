import { motion, AnimatePresence } from "framer-motion";
import { Skip } from "../types";
import { calculateTotalPrice } from "../utils";
import { CrossIcon, RecycleIcon } from "./Icons";
interface SkipDetailsModalProps {
  skip: Skip | null;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

const SkipDetailsModal = ({ skip, isOpen, onClose, onConfirm }: SkipDetailsModalProps) => {
  if (!skip) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 bg-black/50 z-40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center md:p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-white md:rounded-xl shadow-xl md:max-w-xl w-full h-full max-h-screen md:max-h-[90vh] flex flex-col overflow-hidden"
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Fixed Header with close button */}
              <div className="flex justify-between items-center p-4 border-b border-gray-200 bg-white sticky top-0 z-10">
                <h2 className="text-xl font-bold text-gray-800">Skip Details</h2>
                <button
                  onClick={onClose}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <CrossIcon className="w-6 h-6" />
                </button>
              </div>

              {/* Scrollable Modal content */}
              <div className="overflow-y-auto p-6">
                <div className="mb-6">
                  <div className="relative h-48 rounded-lg overflow-hidden mb-4">
                    <img
                      src="https://images.unsplash.com/photo-1590496793929-36417d3117de?q=80&w=800"
                      alt={`${skip.size} Yard Skip`}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-3 right-3 bg-white text-gray-800 text-sm font-medium px-3 py-1 rounded-full shadow-sm flex items-center">
                     <RecycleIcon className="w-4 h-4 mr-1 text-green-600" />
                      {skip.size} Yards
                    </div>
                    {skip.size >= 20 && (
                      <div className="absolute top-3 left-3 bg-amber-500 text-white text-xs font-bold px-2.5 py-1 rounded-full shadow-sm">
                        LARGE SKIP
                      </div>
                    )}
                  </div>
                  
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">
                    {skip.size} Yard Skip
                  </h3>
                  <p className="text-gray-600 mb-4">
                    This skip comes with a {skip.hire_period_days} day hire period.
                  </p>
                </div>

                {/* Skip features */}
                <div className="mb-6">
                  <h4 className="font-semibold text-gray-800 mb-3">Features</h4>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="flex items-center gap-2">
                      <span className={`w-5 h-5 rounded-full flex items-center justify-center ${
                        skip.allowed_on_road
                          ? "bg-green-100 text-green-600"
                          : "bg-red-100 text-red-600"
                      }`}>
                        {skip.allowed_on_road ? "✓" : "✕"}
                      </span>
                      <span className="text-gray-700">
                        Road placement
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`w-5 h-5 rounded-full flex items-center justify-center ${
                        skip.allows_heavy_waste
                          ? "bg-green-100 text-green-600"
                          : "bg-red-100 text-red-600"
                      }`}>
                        {skip.allows_heavy_waste ? "✓" : "✕"}
                      </span>
                      <span className="text-gray-700">
                        Heavy waste
                      </span>
                    </div>
                  </div>
                </div>

                {/* Pricing breakdown */}
                <div className="bg-gray-50 p-4 rounded-lg mb-6">
                  <h4 className="font-semibold text-gray-800 mb-3">Pricing Breakdown</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Base price:</span>
                      <span>£{skip.price_before_vat}</span>
                    </div>
                    
                    {skip.transport_cost !== null && (
                      <div className="flex justify-between">
                        <span>Transport cost:</span>
                        <span>£{skip.transport_cost}</span>
                      </div>
                    )}
                    
                    {skip.per_tonne_cost !== null && (
                      <div className="flex justify-between">
                        <span>Per tonne cost:</span>
                        <span>£{skip.per_tonne_cost}</span>
                      </div>
                    )}
                    
                    <div className="flex justify-between">
                      <span>VAT ({skip.vat}%):</span>
                      <span>£{Math.round((skip.price_before_vat + (skip.transport_cost || 0)) * (skip.vat / 100))}</span>
                    </div>
                    
                    <div className="flex justify-between font-semibold pt-2 border-t border-gray-200">
                      <span>Total:</span>
                      <span>£{calculateTotalPrice(skip)}</span>
                    </div>
                  </div>
                </div>

                {/* Additional information */}
                {(skip.transport_cost !== null || skip.per_tonne_cost !== null) && (
                  <div className="bg-amber-50 p-4 rounded-lg mb-6 border border-amber-100">
                    <h4 className="font-semibold text-amber-800 mb-2">Special Requirements</h4>
                    <p className="text-sm text-amber-700">
                      This skip has additional costs for transport and disposal. 
                      {skip.transport_cost !== null && ` Transport cost: £${skip.transport_cost}.`}
                      {skip.per_tonne_cost !== null && ` Per tonne cost: £${skip.per_tonne_cost}.`}
                    </p>
                  </div>
                )}

                {/* Usage guidelines */}
          
                  <h4 className="font-semibold text-gray-800 mb-3">Usage Guidelines</h4>
                  <ul className="list-disc pl-5 text-sm text-gray-700 space-y-1">
                    <li>Suitable for {skip.size <= 6 ? "household" : "construction"} waste</li>
                    <li>Cannot be filled above the level of the sides</li>
                    <li>Available for {skip.hire_period_days} days hire period</li>
                    {!skip.allowed_on_road && <li>Cannot be placed on public roads</li>}
                    {!skip.allows_heavy_waste && <li>Not suitable for heavy materials like soil, rubble, or concrete</li>}
                  </ul>
             
              </div>

              {/* Fixed Footer with action buttons */}
              <div className="p-4 border-t border-gray-200 flex justify-end gap-2 bg-white mt-auto">
                <button
                  onClick={onClose}
                  className="px-4 py-2 border border-gray-300 rounded-full text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={onConfirm}
                  disabled={!skip.allows_heavy_waste}
                  className={`px-4 py-2 rounded-full ${
                    skip.allows_heavy_waste
                      ? "bg-green-600 text-white hover:bg-green-700"
                      : "bg-gray-300 text-gray-500 cursor-not-allowed"
                  }`}
                >
                  {skip.allows_heavy_waste ? "Select This Skip" : "Not Available"}
                </button>
              </div>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default SkipDetailsModal; 