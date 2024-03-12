import { Page } from '../types/main';
import { MasterCard } from '../types/master';
import { client } from '../utils/axiosClient';

export const getMasterCard = (pageNumber: number, pageSize: number) => {
  return client.get<Page<MasterCard>>(`/masterSortByRating?pageNumber=${pageNumber}&pageSize=${pageSize}`);
};
