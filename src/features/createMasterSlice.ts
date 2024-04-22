/* eslint-disable no-param-reassign */
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { SubCategory } from '../types/category';
import { EditMaster } from '../types/master';
import { client } from '../utils/axiosClient';

interface UpdateEditMaster extends EditMaster {
  hidden: boolean;
  id: number;
}

export const updateEditMaster = createAsyncThunk(
  'users/updateEditMaster',
  async () => {
    const response = await client.get<UpdateEditMaster>('/master');

    return response;
  },
);

export interface CreateMasterState {
  master: EditMaster;
  hidden: boolean;
  editMode: boolean;
  masterId: number | null;
  editFormShown: boolean;
}

const initialState: CreateMasterState = {
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

const createMasterSlice = createSlice({
  name: 'createMaster',
  initialState,
  reducers: {
    editMaster: (
      state,
      action: PayloadAction<Partial<CreateMasterState['master']>>,
    ) => {
      return {
        ...state,
        master: {
          ...state.master,
          ...action.payload,
        },
      };
    },

    editContacts: (
      state,
      action: PayloadAction<Partial<CreateMasterState['master']['contacts']>>,
    ) => {
      return {
        ...state,
        master: {
          ...state.master,
          contacts: {
            ...state.master.contacts,
            ...action.payload,
          },
        },
      };
    },

    editAddress: (
      state,
      action: PayloadAction<Partial<CreateMasterState['master']['address']>>,
    ) => {
      return {
        ...state,
        master: {
          ...state.master,
          address: {
            ...state.master.address,
            ...action.payload,
          },
        },
      };
    },

    editOptions: (
      state,
      action: PayloadAction<Partial<Omit<CreateMasterState, 'master'>>>,
    ) => {
      return {
        ...state,
        ...action.payload,
      };
    },

    toggleSubcategory: (state, action: PayloadAction<SubCategory>) => {
      const subcategories = state.master.subcategories || [];
      const subcategoryIndex = subcategories.findIndex(
        item => item.id === action.payload.id,
      );

      if (subcategoryIndex !== -1) {
        subcategories.splice(subcategoryIndex, 1);
      } else {
        subcategories.push(action.payload);
      }

      state.master.subcategories = subcategories;
    },

    deleteSubcategory: (state, action: PayloadAction<SubCategory['id']>) => {
      if (state.master.subcategories) {
        state.master.subcategories = state.master.subcategories.filter(
          item => item.id !== action.payload,
        );
      }
    },

    deleteMaster: () => {
      return initialState;
    },
  },
  extraReducers: builder => {
    builder.addCase(updateEditMaster.fulfilled, (state, action) => {
      const {
        firstName,
        lastName,
        contacts,
        address,
        description,
        subcategories,
        hidden,
        id,
      } = action.payload;

      state.master = {
        ...state.master,
        firstName,
        lastName,
        contacts,
        address,
        description,
        subcategories,
      };

      state.hidden = hidden;
      state.masterId = id;
      state.editFormShown = true;
    });
  },
});

export const {
  editMaster,
  editContacts,
  editAddress,
  toggleSubcategory,
  deleteSubcategory,
  editOptions,
  deleteMaster,
} = createMasterSlice.actions;

export default createMasterSlice.reducer;
