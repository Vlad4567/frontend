import {
  useInfiniteQuery,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query';
import {
  addNewReview as apiAddNewReview,
  getReviewsMaster,
} from '../api/master';
import { FormReview } from '../types/master';
import { useNotification } from './useNotification';

const queryKey = 'reviewsMaster';

export const useReviewsMaster = (id: number) => {
  const queryClient = useQueryClient();
  const { addNotification } = useNotification();

  const reviewsMaster = useInfiniteQuery({
    queryKey: [queryKey, id, 20],
    queryFn: ({ pageParam = 0 }) => getReviewsMaster(id, pageParam, 20),
    getNextPageParam: (lastPage, pages) => {
      if (lastPage.last) {
        return undefined;
      }

      return pages.length;
    },
    initialPageParam: 0,
    enabled: !!id,
  });

  const addNewReview = useMutation({
    mutationFn: (form: FormReview) => apiAddNewReview(id, form),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: [queryKey, id, 20] }),
    onError: () => addNotification('error'),
  });

  return {
    reviewsMaster,
    addNewReview,
  };
};
