interface MasterAddress {
  city: string;
  street: string;
  houseNumber: string;
}

interface MasterSubcategory {
  categoryId: number;
  name: string;
}

export interface MasterCard {
  id: number;
  firstName: string;
  lastName: string;
  address: MasterAddress;
  subcategories: MasterSubcategory[] | null;
  rating: number;
  mainPhoto: string | null;
}

export interface FilterMasterCard {
  content: MasterCard[];
  pageable: {
    pageNumber: number;
    pageSize: number;
  };
  first: boolean;
  last: boolean;
  totalElements: number;
  totalPages: number;
  numberOfElements: number;
  empty: boolean;
}

export interface ServiceCard {
  id: number;
  name: string,
  price: number,
  masterCard: Pick<
  MasterCard, 'id' | 'address' | 'firstName' | 'lastName' | 'rating'>
  photo: string | null;
}
