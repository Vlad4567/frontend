export interface SubCategory {
  id: number;
  name: string;
}

export interface Category {
  id: number,
  name: string,
  subcategories: SubCategory[]
}
