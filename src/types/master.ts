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
  name: string;
  price: number;
  masterCard: Pick<
    MasterCard,
    'id' | 'address' | 'firstName' | 'lastName' | 'rating'
  >;
  photo: string | null;
}

export interface EditMaster {
  firstName: string | null;
  lastName: string | null;
  contacts: {
    instagram: string | null;
    facebook: string | null;
    telegram: string | null;
    phone: string | null;
  };
  address: {
    city: City | null;
    street: string | null;
    houseNumber: string | null;
    description: string | null;
  };
  description: string | null;
  subcategories: SubCategory[] | null;
}

export interface PublicMaster extends Omit<EditMaster, 'address'> {
  id: number;
  address: {
    city: string | null;
    street: string | null;
    houseNumber: string | null;
    description: string | null;
  };
  rating: number | null;
  mainPhoto: string | null;
  statistics: {
    count1: number;
    count2: number;
    count3: number;
    count4: number;
    count5: number;
  };
  hidden: boolean;
}

export interface FormReview {
  grade: number;
  comment: string;
}
