import { Skip } from "../types";
import { motion } from "framer-motion";
import { calculateTotalPrice } from "../utils";
import {
  EyeIcon,
  CheckmarkIcon,
  CrossIcon,
  RecycleIcon,
  InfoIcon,
  QuestionIcon,
} from "./Icons";
const SkipCard = ({
  skip,
  selectedSkipId,
  setSelectedSkipId,
  onViewDetails,
}: {
  skip: Skip;
  selectedSkipId: number | null;
  setSelectedSkipId: (id: number) => void;
  onViewDetails: (skip: Skip) => void;
}) => {
  
  const decorationVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.5,
        ease: "easeOut",
      },
    },
  };

  return (
    <motion.div
      key={skip.id}
      className={`
    bg-white/90 backdrop-blur-sm rounded-xl overflow-hidden cursor-pointer relative
    ${
      !skip.allowed_on_road && !skip.allows_heavy_waste
        ? "!opacity-50 saturate-0"
        : ""
    }
    ${
      selectedSkipId === skip.id && skip.allows_heavy_waste
        ? "ring-2 ring-green-500 shadow-lg"
        : "border border-gray-200 hover:shadow-md"
    }
  `}
      onClick={() =>
        skip.allows_heavy_waste ? setSelectedSkipId(skip.id) : null
      }
      variants={decorationVariants}
      whileHover={skip.allows_heavy_waste ? { y: -5 } : {}}
      whileTap={skip.allows_heavy_waste ? { scale: 0.98 } : {}}
    >
      <div className="relative h-48">
        <img
          src="https://images.unsplash.com/photo-1590496793929-36417d3117de?q=80&w=800"
          alt="Skip container"
          className={`
        w-full h-full object-cover
        ${!skip.allows_heavy_waste ? "opacity-60 grayscale" : ""}
      `}
        />

        <motion.div
          className="absolute top-3 right-3 bg-white text-gray-800 text-xs font-medium px-2.5 py-1 rounded-full shadow-sm flex items-center"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <RecycleIcon className="w-3 h-3 mr-1 text-green-600" />
          {skip.size} Yards
        </motion.div>

        {skip.size >= 20 && (
          <motion.div
            className="absolute top-3 left-3 bg-amber-500 text-white text-xs font-bold px-2.5 py-1 rounded-full shadow-sm"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            LARGE SKIP
          </motion.div>
        )}
      </div>

      <div className="p-4">
        <div className="flex justify-between items-start mb-3">
          <div className="flex flex-col">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center">
              <span className="mr-1">{skip.size} Yard Skip</span>
            </h3>
            <span className="text-gray-500 text-xs flex items-center">
              <InfoIcon className="w-3 h-3 mr-1 text-gray-400" />
              {skip.hire_period_days} day hire period
            </span>
          </div>
          <motion.div
            className="flex flex-col items-end group"
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            whileHover={{ scale: 1.05 }}
            transition={{
              type: "spring",
              stiffness: 200,
              delay: 0.4,
            }}
          >
            <span className="text-lg text-green-600 font-bold">
              £{calculateTotalPrice(skip)}
            </span>
            <span className="text-gray-500 text-xs flex items-center relative">
              VAT included
              <QuestionIcon className="w-4 h-4 ml-1 text-gray-400" />
              <div className="absolute bottom-full right-0 mb-1 w-64 p-3 bg-gray-800 text-xs text-white rounded-md shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-opacity z-20">
                <div className="mb-1">Base price: £{skip.price_before_vat}</div>

                {skip.transport_cost !== null && (
                  <div className="mb-1">
                    Transport cost: £{skip.transport_cost}
                  </div>
                )}

                {skip.per_tonne_cost !== null && (
                  <div className="mb-1">
                    Per tonne cost: £{skip.per_tonne_cost}
                  </div>
                )}

                <div className="mb-1">
                  VAT ({skip.vat}%): £
                  {Math.round(
                    (skip.price_before_vat + (skip.transport_cost || 0)) *
                      (skip.vat / 100)
                  )}
                </div>

                <div className="mt-2 pt-2 border-t border-gray-700 font-semibold">
                  Total: £{calculateTotalPrice(skip)}
                </div>

                <div className="absolute -bottom-1 right-2 w-2 h-2 bg-gray-800 transform rotate-45"></div>
              </div>
            </span>
          </motion.div>
        </div>

        <div className="space-y-2 mb-4 text-sm">
          <div className="flex items-center gap-2">
            {skip.allowed_on_road ? (
              <CheckmarkIcon
                className={`w-5 h-5 p-1 rounded-full flex items-center justify-center ${
                  skip.allowed_on_road
                    ? "bg-green-100 text-green-600"
                    : "bg-red-100 text-red-600"
                }`}
              />
            ) : (
              <CrossIcon
                className={`w-5 h-5 p-1 rounded-full flex items-center justify-center ${
                  skip.allowed_on_road
                    ? "bg-green-100 text-green-600"
                    : "bg-red-100 text-red-600"
                }`}
              />
            )}
            <span className="text-gray-700">
              {skip.allowed_on_road
                ? "Road placement allowed"
                : "No road placement"}
            </span>
          </div>
          <div className="flex items-center gap-2">
            {skip.allows_heavy_waste ? (
              <CheckmarkIcon
                className={`w-5 h-5 p-1 rounded-full flex items-center justify-center ${
                  skip.allows_heavy_waste
                    ? "bg-green-100 text-green-600"
                    : "bg-red-100 text-red-600"
                }`}
              />
            ) : (
              <CrossIcon
                className={`w-5 h-5 p-1 rounded-full flex items-center justify-center ${
                  skip.allows_heavy_waste
                    ? "bg-green-100 text-green-600"
                    : "bg-red-100 text-red-600"
                }`}
              />
            )}
            <span className="text-gray-700">
              {skip.allows_heavy_waste
                ? "Heavy waste allowed"
                : "No heavy waste"}
            </span>
          </div>
        </div>

        <div className="flex gap-3 mt-1">
          <motion.button
            className={`
              flex-1 py-2.5 rounded-lg font-medium text-sm transition-all shadow-sm
              ${
                !skip.allows_heavy_waste
                  ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                  : selectedSkipId === skip.id
                  ? "bg-green-50 text-green-700 border border-green-200 ring-1 ring-green-500"
                  : "bg-green-600 text-white hover:bg-green-700"
              }
            `}
            disabled={!skip.allows_heavy_waste}
            whileHover={
              skip.allows_heavy_waste && selectedSkipId !== skip.id
                ? { scale: 1.02, y: -1 }
                : {}
            }
            whileTap={skip.allows_heavy_waste ? { scale: 0.98 } : {}}
          >
            {!skip.allows_heavy_waste ? (
              <span className="flex items-center justify-center">
                <CrossIcon className="w-4 h-4 mr-1  rounded-full" />
                Unavailable
              </span>
            ) : selectedSkipId === skip.id ? (
              <span className="flex items-center justify-center">
                <CheckmarkIcon className="w-4 h-4 mr-1  rounded-full" />
                Selected
              </span>
            ) : (
              "Select Skip"
            )}
          </motion.button>

          <motion.button
            onClick={(e) => {
              e.stopPropagation();
              onViewDetails(skip);
            }}
            className="py-2.5 px-4 rounded-lg font-medium text-sm bg-gray-50 text-gray-700 border border-gray-200 hover:bg-gray-100 hover:text-gray-900 transition-all flex items-center justify-center"
            whileHover={{ scale: 1.02, y: -1 }}
            whileTap={{ scale: 0.98 }}
          >
            <EyeIcon className="w-4 h-4 mr-1" />
            Details
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};

export default SkipCard;
