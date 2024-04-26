import { useQuery } from '@tanstack/react-query';
import { getCategories } from '../api/categories';
import { useState } from 'react';
import { Category } from '../types/category';

const queryKey = 'categories';

export const useCategories = (initialSelectedCategory?: Category) => {
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(
    initialSelectedCategory || null,
  );

  const categories = useQuery({
    queryKey: [queryKey],
    queryFn: getCategories,
    initialData: [],
  });

  return {
    categories,
    selectedCategory,
    setSelectedCategory,
  };
};
