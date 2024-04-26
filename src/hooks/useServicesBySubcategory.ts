import { useState } from 'react';
import { SubCategory } from '../types/category';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  addNewService,
  deleteService as apiDeleteService,
  getServicesBySubcategory,
  putService,
} from '../api/services';
import { Service } from '../types/services';
import { useNotification } from './useNotification';

const queryKey = 'servicesBySubcategory';

export const useServicesBySubcategory = (
  masterId: number,
  initialSubcategory?: SubCategory,
) => {
  const queryClient = useQueryClient();
  const { addNotification } = useNotification();
  const [subcategory, setSubcategory] = useState<SubCategory | null>(
    initialSubcategory || null,
  );
  const [activeService, setActiveService] = useState<Service | null>(null);

  const servicesBySubcategory = useQuery({
    queryKey: [queryKey, masterId, subcategory?.id],
    queryFn: () =>
      getServicesBySubcategory(masterId, (subcategory as SubCategory).id),
    initialData: [],
    enabled: !!subcategory?.id,
  });

  const addService = useMutation({
    mutationFn: addNewService,
    onSuccess: newService => {
      queryClient.setQueryData<Service[]>(
        [queryKey, masterId, subcategory?.id],
        old => [...(old || []), newService],
      );
    },
    onError: () => addNotification('error'),
    onSettled: () =>
      queryClient.invalidateQueries({
        queryKey: [queryKey, masterId, subcategory?.id],
      }),
  });

  const deleteService = useMutation({
    mutationFn: apiDeleteService,
    onSuccess: (_, id) => {
      queryClient.setQueryData<Service[]>(
        [queryKey, masterId, subcategory?.id],
        old => (old || []).filter(service => service.id !== id),
      );
    },
    onError: () => addNotification('error'),
    onSettled: () =>
      queryClient.invalidateQueries({
        queryKey: [queryKey, masterId, subcategory?.id],
      }),
  });

  const changeService = useMutation({
    mutationFn: putService,
    onSuccess: service => {
      queryClient.setQueryData<Service[]>(
        [queryKey, masterId, subcategory?.id],
        old =>
          (old || []).map(currService =>
            currService.id === service.id ? service : currService,
          ),
      );
    },
    onError: () => addNotification('error'),
    onSettled: () =>
      queryClient.invalidateQueries({
        queryKey: [queryKey, masterId, subcategory?.id],
      }),
  });

  return {
    subcategory,
    setSubcategory,
    servicesBySubcategory,
    addService,
    deleteService,
    changeService,
    activeService,
    setActiveService,
  };
};
