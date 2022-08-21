import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type AuthUser = {
  name: string | null;
  email: string | null;
  photoURL: string | null;
  isLoggedIn: boolean;
};

const initialState: Partial<AuthUser> = {};

const authSlice = createSlice({
  name: "auth",
  initialState: initialState,
  reducers: {
    updateUserAuth: function (state, action: PayloadAction<Partial<AuthUser>>) {
      console.log(state === action.payload);
      console.log({ payload: action.payload });

      state = action.payload;
    },
  },
});

export const { updateUserAuth } = authSlice.actions;
export default authSlice.reducer;
