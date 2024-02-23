import { Category } from '../types/category';
import { client } from '../utils/axiosClient';

export const getCategories = () => {
  return client.get<Category[]>('/categories');
};
