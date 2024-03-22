/* eslint-disable no-param-reassign */
import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { UserData } from '../types/account';
import { listenerMiddleware } from '../app/listenerMiddleware';
import { downloadPhoto } from '../api/account';

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
    deleteMaster: (state) => {
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

export const {
  updateUser,
  updateProfilePhoto,
  deleteMaster,
} = userSlice.actions;
export default userSlice.reducer;

listenerMiddleware.startListening({
  actionCreator: updateUser,
  effect: async (action, listenerAPI) => {
    if (action.payload.profilePhoto) {
      await downloadPhoto(action.payload.profilePhoto)
        .then(data => {
          listenerAPI.dispatch(updateProfilePhoto(URL.createObjectURL(
            new Blob([data],
              { type: 'image/jpeg' }),
          )));
        });
    }
  },
});
