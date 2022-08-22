import { configureStore } from "@reduxjs/toolkit";
import logger from "redux-logger";
import authSlice from "../features/auth/auth-slice";
import categorySlice from "../features/category/category-slice";
import dialogSlice from "../features/dialog/dialog-slice";
import txnSlice from "../features/transactions/transactions-slice";
import walletsSlice from "../features/wallets/wallets-slice";

export const store = configureStore({
  reducer: {
    transactions: txnSlice,
    categories: categorySlice,
    walletState: walletsSlice,
    dialog: dialogSlice,
    auth: authSlice,
  },
  middleware: [logger],
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
