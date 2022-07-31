import { configureStore } from "@reduxjs/toolkit";
import categorySlice from "../features/category/category-slice";
import txnSlice from "../features/transactions/transactions-slice";

export const store = configureStore({
  reducer: {
    transactions: txnSlice,
    categories: categorySlice,
  },
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
