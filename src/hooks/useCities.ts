import { useQuery } from '@tanstack/react-query';
import { getCities } from '../api/searchPage';
import { useState } from 'react';

export const useCities = (initialCityValue?: string) => {
  const [cityValue, setCityValue] = useState(initialCityValue || '');

  const cities = useQuery({
    queryKey: ['cities', 0, 4, cityValue],
    queryFn: () => getCities(0, 4, cityValue).then(res => res.content),
    initialData: [],
    enabled: !!cityValue,
  });

  return {
    cities,
    cityValue,
    setCityValue,
  };
};
