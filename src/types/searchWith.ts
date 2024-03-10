export type SearchWithParam = string | number;

export type SearchWithParams = {
  [key: string]: SearchWithParam[] | SearchWithParam | null;
};
