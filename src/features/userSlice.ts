/* eslint-disable no-param-reassign */
import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { UserData } from '../types/account';

const initialState: {
  user: UserData;
} = {
  user: {
    email: '',
    username: '',
    profilePhoto: null,
    master: false,
    telegramAccount: null,
  },
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    updateUser: (state, action: PayloadAction<Partial<UserData>>) => {
      return {
        ...state,
        user: {
          ...state.user,
          ...action.payload,
        },
      };
    },
    updateProfilePhoto: (state, action: PayloadAction<string>) => {
      return {
        ...state,
        user: {
          ...state.user,
          profilePhoto: action.payload,
        },
      };
    },
    deleteMaster: state => {
      return {
        ...state,
        user: {
          ...state.user,
          master: false,
        },
      };
    },
  },
});

export const { updateUser, updateProfilePhoto, deleteMaster } =
  userSlice.actions;
export default userSlice.reducer;
