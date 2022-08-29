import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ICategory } from "../category/category-slice";

export interface Transaction {
  id: string;
  uid: string;
  amount: number;
  note?: string;
  category: ICategory;
  labels?: string[];
  displayDate: string;
  createAt: string;
  updateAt: string;
}

const initialState: Transaction[] = [];

const transactionsSlice = createSlice({
  name: "transactions",
  initialState: initialState,
  reducers: {
    addTransaction: (state, action: PayloadAction<Transaction>) => {
      state.push(action.payload);
    },
  },
});

export const { addTransaction } = transactionsSlice.actions;
export default transactionsSlice.reducer;
