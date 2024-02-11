/* eslint-disable no-param-reassign */
import { PayloadAction, createSlice } from '@reduxjs/toolkit';

type HeaderType = 'dark' | 'light';

const initialState: {
  headerShown: boolean,
  headerType: HeaderType,
  footerShown: boolean,
} = {
  headerShown: true,
  headerType: 'dark',
  footerShown: true,
};

const appSlice = createSlice({
  name: 'app',
  initialState,
  reducers: {
    setShownHeader: (state, action: PayloadAction<boolean>) => {
      state.headerShown = action.payload;
    },
    setHeaderType: (state, action: PayloadAction<HeaderType>) => {
      state.headerType = action.payload;
    },
    setShownFooter: (state, action: PayloadAction<boolean>) => {
      state.footerShown = action.payload;
    },
  },
});

export const {
  setShownHeader,
  setHeaderType,
  setShownFooter,
} = appSlice.actions;
export default appSlice.reducer;
