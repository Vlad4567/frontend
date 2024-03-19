import { Page } from '../types/main';
import { CreateMaster, MasterCard } from '../types/master';
import { client } from '../utils/axiosClient';

export const getMasterCard = (pageNumber: number, pageSize: number) => {
  return client.get<Page<MasterCard>>(`/masterSortByRating?pageNumber=${pageNumber}&pageSize=${pageSize}`);
};

export const createMaster = (master: CreateMaster) => {
  return client.post('/new-master', master);
};
