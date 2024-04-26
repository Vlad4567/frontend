import { useQuery } from '@tanstack/react-query';
import { getMaster, getRandomMasterPhotos } from '../api/master';

const queryKey = 'master';

export const useMaster = (id: number) => {
  const master = useQuery({
    queryKey: [queryKey, id],
    queryFn: () => getMaster(id),
  });

  const randomMasterPhotos = useQuery({
    queryKey: ['randomMasterPhotos', id],
    queryFn: () => getRandomMasterPhotos(id),
  });

  return {
    master,
    randomMasterPhotos,
  };
};
