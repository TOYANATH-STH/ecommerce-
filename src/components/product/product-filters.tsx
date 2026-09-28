"use client";

import { useState } from "react";
import { SlidersHorizontal, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface FilterOption {
  label: string;
  value: string;
}

interface ProductFiltersProps {
  categories: FilterOption[];
  brands: FilterOption[];
  className?: string;
}

export interface FilterState {
  categories: string[];
  brands: string[];
  priceRange: [number, number];
  rating: number;
  inStock: boolean;
  sortBy: string;
}

const defaultFilters: FilterState = {
  categories: [],
  brands: [],
  priceRange: [0, 100000],
  rating: 0,
  inStock: false,
  sortBy: "newest",
};

export function ProductFilters({
  categories,
  brands,
  className = "",
}: ProductFiltersProps) {
  const [filters, setFilters] = useState<FilterState>(defaultFilters);
  const [isOpen, setIsOpen] = useState(false);

  const updateFilters = (updates: Partial<FilterState>) => {
    const newFilters = { ...filters, ...updates };
    setFilters(newFilters);
  };

  const clearFilters = () => {
    setFilters(defaultFilters);
  };

  const activeFilterCount =
    filters.categories.length +
    filters.brands.length +
    (filters.rating > 0 ? 1 : 0) +
    (filters.inStock ? 1 : 0);

  const filterContent = (
    <div className="space-y-6">
      {/* Categories */}
      <div>
        <h3 className="font-semibold mb-3">Categories</h3>
        <div className="space-y-2 max-h-48 overflow-y-auto">
          {categories.map((category) => (
            <div key={category.value} className="flex items-center space-x-2">
              <Checkbox
                id={`cat-${category.value}`}
                checked={filters.categories.includes(category.value)}
                onCheckedChange={(checked) => {
                  const newCategories = checked
                    ? [...filters.categories, category.value]
                    : filters.categories.filter((c) => c !== category.value);
                  updateFilters({ categories: newCategories });
                }}
              />
              <label
                htmlFor={`cat-${category.value}`}
                className="text-sm cursor-pointer"
              >
                {category.label}
              </label>
            </div>
          ))}
        </div>
      </div>

      {/* Brands */}
      <div>
        <h3 className="font-semibold mb-3">Brands</h3>
        <div className="space-y-2 max-h-48 overflow-y-auto">
          {brands.map((brand) => (
            <div key={brand.value} className="flex items-center space-x-2">
              <Checkbox
                id={`brand-${brand.value}`}
                checked={filters.brands.includes(brand.value)}
                onCheckedChange={(checked) => {
                  const newBrands = checked
                    ? [...filters.brands, brand.value]
                    : filters.brands.filter((b) => b !== brand.value);
                  updateFilters({ brands: newBrands });
                }}
              />
              <label
                htmlFor={`brand-${brand.value}`}
                className="text-sm cursor-pointer"
              >
                {brand.label}
              </label>
            </div>
          ))}
        </div>
      </div>

      {/* Price Range */}
      <div>
        <h3 className="font-semibold mb-3">Price Range</h3>
        <div className="flex items-center gap-2">
          <Input
            type="number"
            placeholder="Min"
            value={filters.priceRange[0] || ""}
            onChange={(e) =>
              updateFilters({
                priceRange: [Number(e.target.value), filters.priceRange[1]],
              })
            }
            className="w-24"
          />
          <span>-</span>
          <Input
            type="number"
            placeholder="Max"
            value={filters.priceRange[1] === 100000 ? "" : filters.priceRange[1]}
            onChange={(e) =>
              updateFilters({
                priceRange: [filters.priceRange[0], Number(e.target.value) || 100000],
              })
            }
            className="w-24"
          />
        </div>
      </div>

      {/* Rating */}
      <div>
        <h3 className="font-semibold mb-3">Rating</h3>
        <div className="space-y-2">
          {[4, 3, 2, 1].map((rating) => (
            <div key={rating} className="flex items-center space-x-2">
              <Checkbox
                id={`rating-${rating}`}
                checked={filters.rating === rating}
                onCheckedChange={(checked) =>
                  updateFilters({ rating: checked ? rating : 0 })
                }
              />
              <label
                htmlFor={`rating-${rating}`}
                className="text-sm cursor-pointer flex items-center gap-1"
              >
                {rating}+ Stars
              </label>
            </div>
          ))}
        </div>
      </div>

      {/* Availability */}
      <div>
        <h3 className="font-semibold mb-3">Availability</h3>
        <div className="flex items-center space-x-2">
          <Checkbox
            id="in-stock"
            checked={filters.inStock}
            onCheckedChange={(checked) => updateFilters({ inStock: checked })}
          />
          <label htmlFor="in-stock" className="text-sm cursor-pointer">
            In Stock Only
          </label>
        </div>
      </div>

      {/* Clear filters */}
      {activeFilterCount > 0 && (
        <Button variant="outline" className="w-full" onClick={clearFilters}>
          <X className="h-4 w-4 mr-2" />
          Clear All Filters ({activeFilterCount})
        </Button>
      )}
    </div>
  );

  return (
    <>
      {/* Mobile filter button */}
      <div className="lg:hidden mb-4">
        <Button
          variant="outline"
          className="w-full flex items-center justify-between"
          onClick={() => setIsOpen(!isOpen)}
        >
          <span className="flex items-center gap-2">
            <SlidersHorizontal className="h-4 w-4" />
            Filters
            {activeFilterCount > 0 && (
              <Badge className="ml-2">{activeFilterCount}</Badge>
            )}
          </span>
        </Button>

        {isOpen && (
          <div className="mt-4 p-4 border rounded-lg bg-white">
            {filterContent}
          </div>
        )}
      </div>

      {/* Desktop filters */}
      <div className={`hidden lg:block ${className}`}>
        <div className="sticky top-32">
          <h2 className="text-lg font-bold mb-4">Filters</h2>
          {filterContent}
        </div>
      </div>
    </>
  );
}
