import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface IWallet {
  id: string;
  userId: string;
  balance: number;
  name: string;
  createAt: string;
  updateAt?: string;
}

export interface IWalletState {
  selectedWallet?: IWallet;
  wallets: IWallet[];
}
const initialState: IWalletState = {
  wallets: [],
};

const walletsSlice = createSlice({
  name: "wallets",
  initialState,
  reducers: {
    addWallet: function (state, action: PayloadAction<IWallet>) {
      state.wallets.push(action.payload);
      if (!state.selectedWallet) {
        state.selectedWallet = action.payload;
      }
    },
    selectWallet: function (state, action: PayloadAction<string>) {
      const { wallets } = state;
      const { payload: walletId } = action;
      state.selectedWallet = wallets.find((w) => w.id === walletId);
    },
  },
});

export const { addWallet, selectWallet } = walletsSlice.actions;
export default walletsSlice.reducer;
