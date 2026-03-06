import React from "react";
import PropTypes from "prop-types";
import { motion } from "framer-motion";

const DayFilterTabs = ({ activeTab, onTabChange }) => {
  const tabs = [
    { value: 7, label: "7 días" },
    { value: 14, label: "14 días" },
    { value: 30, label: "30 días" },
  ];

  return (
    <nav className="w-full" aria-label="Filtro de período">
      <div
        className="flex p-1 bg-white border border-gray-100 rounded-xl gap-2 shadow-md"
        role="tablist"
      >
        {tabs.map((tab) => {
          const isActive = activeTab === tab.value;

          return (
            <button
              key={tab.value}
              role="tab"
              aria-selected={isActive}
              onClick={() => onTabChange(tab.value)}
              className={`
                relative flex-1 py-2.5 px-4 rounded-lg text-sm font-bold
                transition-all duration-200 outline-none cursor-pointer
                focus-visible:ring-2 focus-visible:ring-orange-600
                ${isActive ? "text-white" : "text-gray-600 hover:bg-orange-100 hover:text-gray-700"}
              `}
            >
              {isActive && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute inset-0 bg-orange-500 rounded-lg z-0"
                  transition={{ type: "spring", bounce: 0, duration: 0.4 }}
                />
              )}

              <span className="relative z-10">{tab.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};

DayFilterTabs.propTypes = {
  activeTab: PropTypes.oneOf([7, 14, 30]).isRequired,
  onTabChange: PropTypes.func.isRequired,
};

export default DayFilterTabs;
