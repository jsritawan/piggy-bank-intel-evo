import { configureStore, Middleware } from "@reduxjs/toolkit";
import { createLogger } from "redux-logger";
import authSlice from "../features/auth/auth-slice";
import categorySlice from "../features/category/category-slice";
import dialogSlice from "../features/dialog/dialog-slice";
import masterSlice from "../features/master/master-slice";
import txnSlice from "../features/transactions/transactions-slice";
import walletsSlice from "../features/wallets/wallets-slice";

export const store = configureStore({
  reducer: {
    txn: txnSlice,
    categories: categorySlice,
    walletState: walletsSlice,
    dialog: dialogSlice,
    auth: authSlice,
    master: masterSlice,
  },
  middleware: (getDefaultMiddleware) => {
    const middleware: Middleware[] = [];
    if (process.env.NODE_ENV !== "production") {
      const logger = createLogger();
      middleware.push(logger);
    }
    return getDefaultMiddleware().concat(middleware);
  },
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
