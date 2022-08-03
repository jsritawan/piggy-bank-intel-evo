import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface IDialog {
  openCreateWallet: boolean;
}

const initialState: Partial<IDialog> = {};

const dialogSlice = createSlice({
  name: "dialog",
  initialState,
  reducers: {
    toggleDialog: function (state, action: PayloadAction<keyof IDialog>) {
      state[action.payload] = !state[action.payload];
    },
  },
});

export const { toggleDialog } = dialogSlice.actions;
export default dialogSlice.reducer;
