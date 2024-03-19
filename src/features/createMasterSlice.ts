/* eslint-disable no-param-reassign */
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { SubCategory } from '../types/category';
import { City } from '../types/searchPage';

export interface CreateMasterState {
  firstName: string | null;
  lastName: string | null;
  contacts: {
    instagram: string | null;
    facebook: string | null;
    telegram: string | null;
    phone: string | null;
  };
  address: {
    city: City | null;
    street: string | null;
    houseNumber: string | null;
    description: string | null;
  };
  description: string | null;
  subcategories: SubCategory[] | null;
}

const initialState: CreateMasterState = {
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
};

const createMasterSlice = createSlice({
  name: 'createMaster',
  initialState,
  reducers: {
    editCreateMaster: (
      state,
      action: PayloadAction<Partial<CreateMasterState>>,
    ) => {
      return {
        ...state,
        ...action.payload,
      };
    },

    editContacts: (
      state,
      action: PayloadAction<Partial<CreateMasterState['contacts']>>,
    ) => {
      return {
        ...state,
        contacts: {
          ...state.contacts,
          ...action.payload,
        },
      };
    },

    editAddress: (
      state,
      action: PayloadAction<Partial<CreateMasterState['address']>>,
    ) => {
      return {
        ...state,
        address: {
          ...state.address,
          ...action.payload,
        },
      };
    },

    toggleSubcategory: (state, action: PayloadAction<SubCategory>) => {
      if (state.subcategories?.find(item => item.id === action.payload.id)) {
        state.subcategories = state.subcategories.filter(
          item => item.id !== action.payload.id,
        );
      } else {
        state.subcategories = [
          ...(state.subcategories || []),
          action.payload,
        ];
      }
    },

    deleteSubcategory: (state, action: PayloadAction<SubCategory['id']>) => {
      if (state.subcategories) {
        state.subcategories = state.subcategories.filter(
          item => item.id !== action.payload,
        );
      }
    },
  },
});

export const {
  editCreateMaster,
  editContacts,
  editAddress,
  toggleSubcategory,
  deleteSubcategory,
} = createMasterSlice.actions;

export default createMasterSlice.reducer;
