/* eslint-disable no-param-reassign */
import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { UserData } from '../types/account';
import { objectKeys } from '../helpers/functions';

const initialState: {
  user: UserData
} = {
  user: {
    email: '',
    username: '',
    profilePhoto: null,
    master: false,
  },
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    updateUser: (state, action: PayloadAction<Partial<UserData>>) => {
      objectKeys(action.payload).forEach(key => {
        (state.user[key] as UserData[keyof UserData])
          = action.payload[key] as UserData[keyof UserData];
      });
    },
  },
});

export const {
  updateUser,
} = userSlice.actions;
export default userSlice.reducer;
