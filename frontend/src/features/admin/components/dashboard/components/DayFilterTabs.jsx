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
        className="grid grid-cols-3 gap-1 rounded-xl border border-gray-200 bg-white p-1 shadow-sm"
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
                relative min-h-10 rounded-lg px-2 py-2 text-xs font-bold sm:text-sm
                transition-all duration-200 outline-none cursor-pointer
                focus-visible:ring-2 focus-visible:ring-orange-600 focus-visible:ring-offset-1
                ${isActive ? "text-white" : "text-gray-600 hover:bg-orange-50 active:bg-orange-100"}
              `}
            >
              {isActive && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute inset-0 z-0 rounded-lg bg-orange-500"
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
