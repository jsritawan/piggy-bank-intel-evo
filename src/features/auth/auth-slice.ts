import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type AuthUser = {
  uid: string | null;
  name: string | null;
  email: string | null;
  photoURL: string | null;
  isLoggedIn: boolean;
};

type AuthState = {
  user: AuthUser;
};

const initialState: AuthState = {
  user: {
    uid: null,
    name: null,
    email: null,
    photoURL: null,
    isLoggedIn: false,
  },
};

const authSlice = createSlice({
  name: "auth",
  initialState: initialState,
  reducers: {
    updateUserAuth: function (state, action: PayloadAction<AuthUser>) {
      state.user = action.payload;
    },
  },
});

export const { updateUserAuth } = authSlice.actions;
export default authSlice.reducer;
