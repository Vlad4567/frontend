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

export type TypeCard = 'master' | 'service';

export interface ErrorData<T> {
  timestamp: string,
  status: string,
  error?: T,
  errors?: {
    [key: string]: T
  }
}

export interface Notification {
  id: number,
  title?: string,
  description?: string,
  icon?: string,
}

export type SearchWithParam = string | number;

export interface SearchWithParams {
  [key: string]: SearchWithParam[] | SearchWithParam | null;
}

export interface ContactUs {
  name: string;
  email: string;
  message: string;
}
