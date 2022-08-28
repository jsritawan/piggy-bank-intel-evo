import { createSlice } from "@reduxjs/toolkit";

export type CategoryType = 1 | 2;
export interface Category {
  id: string;
  color: string;
  name: string;
  type: CategoryType;
}

// const paletteColors = [
//   "#4bbeeA",
//   "#ba68c8",
//   "#ef5350",
//   "#ff9800",
//   "#4caf50",
//   "#35393e",
// ];

const initialState: Category[] = [
  { id: "1", type: 1, name: "salary", color: "#4caf50" },
  { id: "2", type: 1, name: "gift", color: "#ff9800" },
  { id: "3", type: 2, name: "food", color: "#ef5350" },
  { id: "4", type: 2, name: "transport", color: "#35393E" },
  { id: "5", type: 2, name: "credit card", color: "#ef5350" },
  {
    id: "6",
    type: 2,
    name: "Lorem ipsum dolor sit amet consectetur, adipisicing elit. Magnam, architecto! Enim dolores quas recusandae dolorum aliquid, culpa distinctio esse, debitis, eius commodi perspiciatis! Minima fuga voluptate vero officiis blanditiis iusto.",
    color: "#ef5350",
  },
];

const categorySlice = createSlice({
  name: "category",
  initialState,
  reducers: {},
});

export default categorySlice.reducer;
