import { SubCategory } from '../types/category';
import { Page } from '../types/main';
import { EditMaster, MasterCard } from '../types/master';
import { City } from '../types/searchPage';
import { client } from '../utils/axiosClient';

export const getMasterCard = (pageNumber: number, pageSize: number) => {
  return client.get<Page<MasterCard>>(`/masterSortByRating?pageNumber=${pageNumber}&pageSize=${pageSize}`);
};

interface CreateMaster extends Omit<EditMaster, 'address' | 'subcategories'> {
  address: {
    cityId: City['id'] | null;
    street: string | null;
    houseNumber: string | null;
    description: string | null;
  };
  subcategories: number[] | null;
}

export const createMaster = (master: CreateMaster) => {
  return client.post('/new-master', master);
};

interface GetEditMaster extends EditMaster {
  hidden: boolean
  id: number
}

export const getEditMaster = () => {
  return client.get<GetEditMaster>('/master');
};

export const putEditMaster = (master: CreateMaster) => {
  return client.put('/master', master);
};

export const deleteMaster = () => {
  return client.delete('/master');
};

export const hideMaster = () => {
  return client.put('/master/hide');
};

export const unhideMaster = () => {
  return client.put('/master/unhide');
};

export const addMasterSubcategory = (id: SubCategory['id']) => {
  return client.post(`/master/subcategory?id=${id}`);
};

export const deleteMasterSubcategory = (id: SubCategory['id']) => {
  return client.delete(`/master/subcategory?id=${id}`);
};
