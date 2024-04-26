import { useInfiniteQuery } from '@tanstack/react-query';
import { getRatingMasterCards } from '../api/master';

const queryKey = 'ratingMasterCards';

export const useRatingMasterCard = () => {
  const ratingMasterCards = useInfiniteQuery({
    queryKey: [queryKey],
    queryFn: ({ pageParam = 0 }) => getRatingMasterCards(pageParam, 20),
    getNextPageParam: (lastPage, pages) => {
      if (lastPage.totalPages > pages.length) {
        return pages.length;
      }

      return undefined;
    },
    initialPageParam: 0,
  });

  return {
    ratingMasterCards,
  };
};
