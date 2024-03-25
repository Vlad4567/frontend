/* eslint-disable no-param-reassign */
import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { PublicMaster } from '../types/master';

export interface InitialState {
  master: PublicMaster
}

const initialState: InitialState = {
  master: {
    id: -1,
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
    rating: null,
    mainPhoto: null,
    statistics: {
      count1: 0,
      count2: 0,
      count3: 0,
      count4: 0,
      count5: 0,
    },
    hidden: false,
  },
};

const publicMasterSlice = createSlice({
  name: 'publicMaster',
  initialState,
  reducers: {
    updateMaster: (state, action: PayloadAction<Partial<PublicMaster>>) => {
      return {
        ...state,
        master: {
          ...state.master,
          ...action.payload,
        },
      };
    },
  },
});

export const {
  updateMaster,
} = publicMasterSlice.actions;
export default publicMasterSlice.reducer;
