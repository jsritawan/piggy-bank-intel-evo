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
  defaultWallet?: IWallet;
}

const initialState: IWalletState = {
  wallets: [],
};

const walletsSlice = createSlice({
  name: "wallets",
  initialState,
  reducers: {
    setWallets: function (state, action: PayloadAction<IWallet[]>) {
      state.wallets = action.payload ?? [];
    },
    setDefaultWallet: (state, action: PayloadAction<IWallet | undefined>) => {
      state.defaultWallet = action.payload;
    },
  },
});

export const { setWallets, setDefaultWallet } = walletsSlice.actions;
export default walletsSlice.reducer;
