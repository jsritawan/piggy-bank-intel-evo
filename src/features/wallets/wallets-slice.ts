import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface IWallet {
  id: string;
  uid: string | null;
  balance: number;
  name: string;
  default?: boolean;
  createAt: string;
  updateAt: string;
}

export interface IWalletState {
  wallets: IWallet[];
}

const initialState: IWalletState = {
  wallets: [],
};

const walletsSlice = createSlice({
  name: "wallets",
  initialState,
  reducers: {
    setWallet: function (state, action: PayloadAction<IWallet[]>) {
      state.wallets = action.payload ?? [];
    },
  },
});

export const { setWallet } = walletsSlice.actions;
export default walletsSlice.reducer;
