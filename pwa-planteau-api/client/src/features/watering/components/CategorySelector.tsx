import React from 'react';

interface Category {
  label: string;
  color: string;
  value: string;
}

interface CategorySelectorProps {
  categories: Category[];
  selectedCategory: string;
  setSelectedCategory: (v: string) => void;
}

const CategorySelector: React.FC<CategorySelectorProps> = ({
  categories,
  selectedCategory,
  setSelectedCategory,
}) => (
  <div className="mb-4">
    <div className="flex gap-2 flex-wrap">
      {categories.map(cat => (
        <button
          key={cat.value}
          className={`flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold border ${
            selectedCategory === cat.value
              ? `${cat.color} border-green-600`
              : 'bg-gray-100 border-gray-200'
          }`}
          onClick={() => setSelectedCategory(cat.value)}
          type="button"
        >
          <span
            className={`w-2 h-2 rounded-full ${selectedCategory === cat.value ? 'bg-green-700' : 'bg-gray-400'}`}
          />
          {cat.label}
        </button>
      ))}
    </div>
  </div>
);

export default CategorySelector;
