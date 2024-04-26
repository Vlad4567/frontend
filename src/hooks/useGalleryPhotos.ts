import {
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';
import { SubCategory } from '../types/category';
import { useState } from 'react';
import {
  getGalleryPhotos,
  updateMainPhoto as apiUpdateMainPhoto,
  deleteGalleryPhoto as apiDeleteGalleryPhoto,
  addGalleryPhoto as apiAddGalleryPhoto,
} from '../api/gallery';
import { GalleryPhoto } from '../types/gallery';
import { useNotification } from './useNotification';

const queryKey = 'galleryPhotos';

export const useGalleryPhotos = (
  initialSelectedSubcategory?: SubCategory,
  masterCardId?: number,
) => {
  const { addNotification } = useNotification();
  const queryClient = useQueryClient();
  const [selectedSubcategory, setSelectedSubcategory] =
    useState<SubCategory | null>(initialSelectedSubcategory || null);
  const [mainPhoto, setMainPhoto] = useState<GalleryPhoto | null>(null);
  const [isSelectPhoto, setIsSelectPhoto] = useState(false);

  const addToStoragePhoto = (key: string, url: string) => {
    queryClient.setQueryData<Map<string, string>>(
      [queryKey, 'storage'],
      oldData => {
        const map = oldData || new Map();

        map.set(key, url);

        return map;
      },
    );
  };

  const deleteFromStoragePhoto = (key: string) =>
    queryClient.setQueryData<Map<string, string>>(
      [queryKey, 'storage'],
      oldData => {
        const map = oldData || new Map();

        map.delete(key);

        return map;
      },
    );

  const photoStorage = useQuery({
    queryKey: [queryKey, 'storage'],
    initialData: new Map(),
  });

  const galleryPhotos = useInfiniteQuery({
    queryKey: [queryKey, 5, selectedSubcategory?.id],
    queryFn: async ({ pageParam = 0 }) => {
      const res = await getGalleryPhotos(
        pageParam,
        5,
        (selectedSubcategory as SubCategory).id,
        masterCardId,
        [photoStorage.data, addToStoragePhoto],
      );

      res.content.find(item => {
        if (item.isMain) {
          setMainPhoto(item);

          return true;
        }

        return false;
      });

      return res;
    },
    getNextPageParam: (lastPage, pages) => {
      if (lastPage.totalPages > pages.length) {
        return pages.length;
      }

      return undefined;
    },
    initialPageParam: 0,
    enabled: !!selectedSubcategory,
  });

  const updateMainPhoto = useMutation({
    mutationFn: (photo: GalleryPhoto) => apiUpdateMainPhoto(photo.id),
    onSuccess: (_, photo) => {
      setMainPhoto(photo);
      setIsSelectPhoto(false);
    },
    onSettled: () =>
      queryClient.invalidateQueries({
        queryKey: [queryKey, 5, selectedSubcategory?.id],
      }),
    onError: () => addNotification('error'),
  });

  const deleteGalleryPhoto = useMutation({
    mutationFn: apiDeleteGalleryPhoto,
    onSuccess: (_, photoId) => {
      deleteFromStoragePhoto(String(photoId));
    },
    onError: () => addNotification('error'),
    onSettled: () =>
      queryClient.invalidateQueries({
        queryKey: [queryKey, 5, selectedSubcategory?.id],
      }),
  });

  const addGalleryPhoto = useMutation({
    mutationFn: (file: File) => {
      if (selectedSubcategory) {
        return apiAddGalleryPhoto(selectedSubcategory.id, { file });
      }

      return Promise.reject(null);
    },
    onSuccess: (photo, photoFile) =>
      addToStoragePhoto(String(photo.id), URL.createObjectURL(photoFile)),
    onError: () => addNotification('error'),
    onSettled: () =>
      queryClient.invalidateQueries({
        queryKey: [queryKey, 5, selectedSubcategory?.id],
      }),
  });

  return {
    selectedSubcategory,
    setSelectedSubcategory,
    galleryPhotos,
    mainPhoto,
    setMainPhoto,
    updateMainPhoto,
    isSelectPhoto,
    setIsSelectPhoto,
    deleteGalleryPhoto,
    addGalleryPhoto,
  };
};
