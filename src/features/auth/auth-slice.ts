import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface IUser {
  uid: string | null;
  name: string | null;
  email: string | null;
  photoURL: string | null;
  authenticated: boolean;
}

interface IUserState {
  user: IUser;
}

const initialState: IUserState = {
  user: {
    uid: null,
    name: null,
    email: null,
    photoURL: null,
    authenticated: false,
  },
};

const authSlice = createSlice({
  name: "auth",
  initialState: initialState,
  reducers: {
    updateUserAuth: function (state, action: PayloadAction<IUser>) {
      state.user = action.payload;
    },
  },
});

export const { updateUserAuth } = authSlice.actions;
export default authSlice.reducer;
