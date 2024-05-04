import {
  useInfiniteQuery,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query';
import {
  addFavoriteMasterCard,
  getFavoriteMasterCards,
  removeFavoriteMasterCard,
} from '../api/favorites';
import { useNotification } from './useNotification';

const queryKey = 'favorite';

export const useFavorite = (favoriteEnabled = false) => {
  const queryClient = useQueryClient();
  const { addNotification } = useNotification();

  const favorite = useInfiniteQuery({
    queryKey: [queryKey],
    queryFn: ({ pageParam = 0 }) => getFavoriteMasterCards(pageParam, 20),
    getNextPageParam: (lastPage, pages) => {
      if (lastPage.totalPages > pages.length) {
        return pages.length;
      }

      return undefined;
    },
    initialPageParam: 0,
    enabled: favoriteEnabled,
  });

  const addFavorite = useMutation({
    mutationFn: addFavoriteMasterCard,
    onError: () => addNotification('error'),
    onSettled: () =>
      queryClient.invalidateQueries({
        queryKey: [queryKey],
      }),
  });

  const removeFavorite = useMutation({
    mutationFn: removeFavoriteMasterCard,
    onError: () => addNotification('error'),
    onSettled: () =>
      queryClient.invalidateQueries({
        queryKey: [queryKey],
      }),
  });

  return {
    favorite,
    addFavorite,
    removeFavorite,
  };
};
