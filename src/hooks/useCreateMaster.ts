import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { EditMaster } from '../types/master';
import {
  addMasterSubcategory,
  createMaster,
  deleteMasterSubcategory,
  getCreateMaster,
  hideMaster,
  putEditMaster,
  unhideMaster,
} from '../api/master';
import { useUser } from './useUser';
import { SubCategory } from '../types/category';
import { useNotification } from './useNotification';

export interface CreateMasterState {
  master: EditMaster;
  hidden: boolean;
  editMode: boolean;
  masterId: number | null;
  editFormShown: boolean;
}

const initialData: CreateMasterState = {
  master: {
    firstName: null,
    lastName: null,
    contacts: {
      instagram: null,
      facebook: null,
      telegram: null,
      phone: null,
    },
    address: {
      city: null,
      street: null,
      houseNumber: null,
      description: null,
    },
    description: null,
    subcategories: null,
  },
  hidden: false,
  editMode: false,
  masterId: null,
  editFormShown: false,
};

const queryKey = 'createMaster';

export const useCreateMaster = () => {
  const queryClient = useQueryClient();
  const {
    queryUser,
    deleteMaster: deleteUserMaster,
    updateUserState,
  } = useUser();
  const { addNotification } = useNotification();

  const createMasterData = useQuery({
    queryKey: [queryKey],
    queryFn: () =>
      getCreateMaster().then(res => ({
        ...initialData,
        master: {
          ...initialData.master,
          firstName: res.firstName,
          lastName: res.lastName,
          contacts: res.contacts,
          address: res.address,
          description: res.description,
          subcategories: res.subcategories,
        },
        hidden: res.hidden,
        masterId: res.id,
        editFormShown: true,
      })),
    initialData,
    enabled: !!queryUser.data.master,
  });

  const editMaster = (master: Partial<CreateMasterState['master']>) => {
    queryClient.setQueryData<CreateMasterState>([queryKey], {
      ...createMasterData.data,
      master: {
        ...createMasterData.data.master,
        ...master,
      },
    });
  };

  const editContacts = (
    contacts: Partial<CreateMasterState['master']['contacts']>,
  ) => {
    queryClient.setQueryData<CreateMasterState>([queryKey], {
      ...createMasterData.data,
      master: {
        ...createMasterData.data.master,
        contacts: {
          ...createMasterData.data.master.contacts,
          ...contacts,
        },
      },
    });
  };

  const editAddress = (
    address: Partial<CreateMasterState['master']['address']>,
  ) => {
    queryClient.setQueryData<CreateMasterState>([queryKey], {
      ...createMasterData.data,
      master: {
        ...createMasterData.data.master,
        address: {
          ...createMasterData.data.master.address,
          ...address,
        },
      },
    });
  };

  const editOptions = (options: Partial<Omit<CreateMasterState, 'master'>>) => {
    queryClient.setQueryData<CreateMasterState>([queryKey], {
      ...createMasterData.data,
      ...options,
    });
  };

  const toggleSubcategory = useMutation({
    mutationFn: (subcategory: SubCategory) => {
      if (queryUser.data.master) {
        const subcategories = createMasterData.data.master.subcategories || [];
        const subcategoryIndex = subcategories.findIndex(
          item => item.id === subcategory.id,
        );

        if (subcategoryIndex !== -1) {
          return deleteMasterSubcategory(subcategory.id);
        }

        return addMasterSubcategory(subcategory.id);
      }

      return Promise.resolve(subcategory);
    },
    onSuccess: (_, subcategory) => {
      const subcategories = createMasterData.data.master.subcategories || [];
      const subcategoryIndex = subcategories.findIndex(
        item => item.id === subcategory.id,
      );

      if (subcategoryIndex !== -1) {
        subcategories.splice(subcategoryIndex, 1);
      } else {
        subcategories.push(subcategory);
      }

      editMaster({
        subcategories,
      });
    },
    onError: () => addNotification('error'),
  });

  const deleteMaster = async () => {
    return deleteUserMaster.mutateAsync().then(() =>
      queryClient.invalidateQueries({
        queryKey: [queryKey],
      }),
    );
  };

  const toggleHideProfileMutate = useMutation({
    mutationFn: () =>
      createMasterData.data.hidden ? unhideMaster() : hideMaster(),
    onSuccess: () => {
      queryClient.setQueryData<CreateMasterState>([queryKey], {
        ...createMasterData.data,
        hidden: !createMasterData.data.hidden,
      });
    },
    onError: () => addNotification('error'),
  });

  const saveChanges = useMutation({
    mutationFn: () =>
      putEditMaster({
        ...createMasterData.data.master,
        address: {
          ...createMasterData.data.master.address,
          cityId: createMasterData.data.master.address.city?.id || null,
        },
        subcategories:
          createMasterData.data.master.subcategories?.map(item => item.id) ||
          null,
      }),
    onSuccess: () => {
      editOptions({
        editMode: false,
      });
      queryClient.invalidateQueries({ queryKey: [queryKey] });
    },
    onError: () => addNotification('error'),
  });

  const createNewMaster = useMutation({
    mutationFn: () =>
      createMaster({
        ...createMasterData.data.master,
        address: {
          ...createMasterData.data.master.address,
          cityId: createMasterData.data.master.address.city?.id || null,
        },
        subcategories:
          createMasterData.data.master.subcategories?.map(item => item.id) ||
          null,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [queryKey] });
      updateUserState({ master: true });
    },
    onError: () => addNotification('error'),
  });

  return {
    createMasterData,
    editMaster,
    editContacts,
    editAddress,
    editOptions,
    toggleSubcategory,
    deleteMaster,
    toggleHideProfileMutate,
    saveChanges,
    createMaster: createNewMaster,
  };
};
