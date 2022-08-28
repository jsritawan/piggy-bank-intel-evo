import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { differenceInDays } from "date-fns";
import { getDocs } from "firebase/firestore";
import { masterPaletteColorRef } from "../../firebase";
import { MasPaletteColor } from "../../models/master-data";

type InitialStateType = {
  paletteColors: MasPaletteColor[];
};

const initialState: InitialStateType = {
  paletteColors: [],
};

export const fetchMasCatColors = createAsyncThunk(
  "master/fetchMasCatColors",
  async () => {
    const paletteColors = window.localStorage.getItem("paletteColors");
    if (paletteColors) {
      const pMaster = JSON.parse(paletteColors);
      const day = differenceInDays(new Date(), new Date(pMaster.date));
      if (day <= 1) {
        return pMaster.paletteColors;
      }
    }

    const snapshot = await getDocs(masterPaletteColorRef);
    const masCatColors = snapshot.docs.map((doc): MasPaletteColor => {
      const data = doc.data() as MasPaletteColor;
      return { ...data, id: doc.id };
    });
    window.localStorage.setItem(
      "paletteColors",
      JSON.stringify({
        paletteColors: masCatColors,
        date: new Date().toString(),
      })
    );
    return masCatColors;
  }
);

const masterSlice = createSlice({
  name: "master",
  initialState,
  reducers: {},
  extraReducers: function (builder) {
    builder.addCase(fetchMasCatColors.fulfilled, (state, action) => {
      state.paletteColors = action.payload;
    });
  },
});

// export const {} = masterSlice.actions;

export default masterSlice.reducer;
