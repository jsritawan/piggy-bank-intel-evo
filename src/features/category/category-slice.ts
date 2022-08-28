import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  addDoc,
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
import {
  auth,
  categoryRef,
  db,
  masCatColRef,
  masColorColRef,
} from "../../firebase";

export interface Category {
  uid: string;
  id: string;
  color: string;
  name: string;
  type: number;
  isDeletable?: boolean;
  useAt?: Timestamp;
  createAt: Timestamp;
  updateAt?: Timestamp;
}

export const fetchCategories = createAsyncThunk(
  "category/fetchCategories",
  async (uid: string) => {
    const q = query(categoryRef, where("uid", "==", uid), orderBy("name"));
    const snapshot = await getDocs(q);

    console.log(snapshot.docs);

    if (isEmpty(snapshot.docs)) {
      const masSnapshot = await getDocs(query(masCatColRef, orderBy("name")));

      // const batch = writeBatch(db)
      // const docRef = doc(categoryRef)
      // masSnapshot.docs.forEach(doc => {

      //         const {color,name,type,isDeletable} = doc.data()
      //         batch.set(docRef, {
      //           uid,
      // color,name,type,
      // isDeletable: typeof isDeletable ==='undefined'
      // createAt: serverTimestamp()
      //         })
      // })
      // batch.commit()
      console.log(masSnapshot.docs.map((d) => d.data()));
    }
    return snapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
  }
);

const initialState: {
  categories: Category[];
} = {
  categories: [],
};

const categorySlice = createSlice({
  name: "category",
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder.addCase(fetchCategories.fulfilled, (state, action) => {
      // state.categories = action.payload;
    });
  },
});

export default categorySlice.reducer;
