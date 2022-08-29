import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ICategory } from "../category/category-slice";

export interface ITransaction {
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

const initialState: ITransaction[] = [];

const transactionsSlice = createSlice({
  name: "transactions",
  initialState: initialState,
  reducers: {
    addTransaction: (state, action: PayloadAction<ITransaction>) => {
      state.push(action.payload);
    },
  },
});

export const { addTransaction } = transactionsSlice.actions;
export default transactionsSlice.reducer;
