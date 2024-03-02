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
  subcategories: MasterSubcategory[];
  rating: number;
  mainPhoto: string;
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

export interface User {
  email: string
  profilePhoto: string | null
  username: string
}

export interface Review {
  comment: string
  dateTime: string
  grade: number
  id: number
  masterCardId: number
  user: User
}

export interface Page<T> {
  content: T[];
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
