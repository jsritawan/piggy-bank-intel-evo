import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface IDialog {
  openCreateWallet: boolean;
}

const initialState: Partial<IDialog> = {};

const dialogSlice = createSlice({
  name: "dialog",
  initialState,
  reducers: {
    setDialog: function (
      state,
      action: PayloadAction<{ name: keyof IDialog; open: boolean }>
    ) {
      const { name, open } = action.payload;
      state[name] = open;
    },
  },
});

export const { setDialog } = dialogSlice.actions;
export default dialogSlice.reducer;
