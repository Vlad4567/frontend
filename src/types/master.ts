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
