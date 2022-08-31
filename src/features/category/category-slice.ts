import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
  getDocs,
  orderBy,
  query,
  Timestamp,
  where,
  writeBatch,
  doc,
  serverTimestamp,
} from "firebase/firestore";
import { isEmpty } from "lodash";
import { categoryRef, db, masCatColRef } from "../../firebase";

export interface ICategory {
  uid: string;
  id: string;
  color: string;
  name: string;
  type: number;
  isDeletable?: boolean;
  isEditable?: boolean;
  createAt: string;
  updateAt?: string;
}

export const fetchCategories = createAsyncThunk(
  "category/fetchCategories",
  async (uid: string) => {
    const q = query(categoryRef, where("uid", "==", uid), orderBy("name"));
    let snapshot = await getDocs(q);

    if (isEmpty(snapshot.docs)) {
      try {
        const masSnapshot = await getDocs(query(masCatColRef, orderBy("name")));
        const batch = writeBatch(db);
        masSnapshot.docs.forEach(async (d) => {
          const data = d.data();
          const { color, name, type, isDeletable, isEditable } = data;
          batch.set(doc(categoryRef), {
            color,
            name,
            type,
            uid,
            isDeletable: data["isDeletable"] !== undefined ? isDeletable : true,
            isEditable: data["isEditable"] !== undefined ? isEditable : true,
            createAt: serverTimestamp(),
            updateAt: serverTimestamp(),
          });
        });

        await batch.commit();
        snapshot = await getDocs(q);
      } catch (error) {
        console.error(error);
      }
    }

    const categories = snapshot.docs.map((doc) => {
      const data = doc.data();
      const { color, name, type, isDeletable, isEditable, createAt, updateAt } =
        data;

      const category: ICategory = {
        id: doc.id,
        color,
        name,
        type,
        uid,
        isDeletable: data["isDeletable"] !== undefined ? isDeletable : true,
        isEditable: data["isEditable"] !== undefined ? isEditable : true,
        createAt: (createAt as Timestamp).valueOf(),
        updateAt: updateAt ? (updateAt as Timestamp).valueOf() : undefined,
      };

      return category;
    });
    return categories;
  }
);

const initialState: {
  categories: ICategory[];
} = {
  categories: [],
};

const categorySlice = createSlice({
  name: "category",
  initialState,
  reducers: {
    setCategories: (state, action: PayloadAction<ICategory[]>) => {
      state.categories = action.payload;
    },
  },
  extraReducers(builder) {
    builder
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.categories = action.payload;
      })
      .addCase(fetchCategories.rejected, (state, action) => {
        console.error(action.error.message);
      });
  },
});

export const { setCategories } = categorySlice.actions;
export default categorySlice.reducer;
