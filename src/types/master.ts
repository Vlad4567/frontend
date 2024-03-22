import { SubCategory } from './category';
import { City } from './searchPage';

interface MasterSubcategory {
  categoryId: number;
  name: string;
}

export interface MasterCard {
  id: number;
  firstName: string;
  lastName: string;
  address: {
    city: string;
    street: string;
    houseNumber: string;
  };
  subcategories: MasterSubcategory[] | null;
  rating: number;
  mainPhoto: string | null;
}

export interface ServiceCard {
  id: number;
  name: string,
  price: number,
  masterCard: Pick<
  MasterCard, 'id' | 'address' | 'firstName' | 'lastName' | 'rating'>
  photo: string | null;
}

export interface EditMaster {
  firstName: string | null,
  lastName: string | null,
  contacts: {
    instagram: string | null,
    facebook: string | null,
    telegram: string | null,
    phone: string | null
  },
  address: {
    city: City | null,
    street: string | null,
    houseNumber: string | null,
    description: string | null
  },
  description: string | null,
  subcategories: SubCategory[] | null
}
