// ProductFilter.jsx (Simplest - no scroll, no max height)
import { filterOptions } from "@/config";
import React, { Fragment, useState, useEffect } from "react";
import { Label } from "../ui/label";
import { Checkbox } from "../ui/checkbox";
import { Separator } from "../ui/separator";
import { Button } from "../ui/button";

export default function ProductFilter({ onFilterChange, initialFilters }) {
  const [selectedFilters, setSelectedFilters] = useState({
    category: [],
    brand: [],
  });

  useEffect(() => {
    if (initialFilters) {
      setSelectedFilters(initialFilters);
    }
  }, [initialFilters]);

  const handleFilterChange = (type, value) => {
    setSelectedFilters((prev) => {
      const isSelected = prev[type].includes(value);
      const updated = isSelected
        ? prev[type].filter((v) => v !== value)
        : [...prev[type], value];

      const newFilters = { ...prev, [type]: updated };
      onFilterChange(newFilters);
      return newFilters;
    });
  };

  const clearAllFilters = () => {
    const clearedFilters = {
      category: [],
      brand: [],
    };
    setSelectedFilters(clearedFilters);
    onFilterChange(clearedFilters);
  };

  const hasActiveFilters =
    selectedFilters.category.length > 0 || selectedFilters.brand.length > 0;

  return (
    <div className="bg-background rounded-lg shadow-sm sticky top-4">
      <div className="p-4 border-b flex justify-between items-center">
        <h2 className="text-lg font-extrabold">Filters</h2>
        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={clearAllFilters}
            className="text-xs h-8"
          >
            Clear All
          </Button>
        )}
      </div>
      <div className="p-4 space-y-4">
        {Object.keys(filterOptions).map((keyItem) => (
          <Fragment key={keyItem}>
            <div>
              <h3 className="text-base font-bold capitalize mb-2">{keyItem}</h3>
              {/* Simple grid without any scroll restrictions */}
              <div className="grid gap-2">
                {filterOptions[keyItem].map((option) => (
                  <Label
                    key={option.id}
                    className="flex font-medium items-center gap-2 py-1"
                  >
                    <Checkbox
                      checked={selectedFilters[keyItem].includes(option.id)}
                      onCheckedChange={() =>
                        handleFilterChange(keyItem, option.id)
                      }
                    />
                    <span className="text-sm">{option.label}</span>
                  </Label>
                ))}
              </div>
            </div>
            <Separator />
          </Fragment>
        ))}
      </div>
    </div>
  );
}
