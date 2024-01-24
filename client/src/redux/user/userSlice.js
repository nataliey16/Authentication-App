//add slice, is a piece of a state
import { createSlice } from "@reduxjs/toolkit";

//Similar to useState
const initialState = {
  currentUser: null,
  loading: false,
  error: false,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  //reducers are the functions we want to add to change the state,
  reducers: {
    signInStart: (state) => {
      state.loading = true;
    },
    signInSuccess: (state, action) => {
      //action: data from signin will be set to action.payload
      state.currentUser = action.payload; //get data from signin/signup page
      state.loading = false;
      state.error = false;
    },
    signInFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
  },
});

export const { signInStart, signInSuccess, signInFailure } = userSlice.actions;
// use these functions later

export default userSlice.reducer;
