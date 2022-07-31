import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Category } from "../category/category-slice";

export interface Transaction {
  id: string;
  amount: number;
  note?: string;
  category: Category;
  labels?: string[];
  displayDate: string;
  createAt: Date;
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
