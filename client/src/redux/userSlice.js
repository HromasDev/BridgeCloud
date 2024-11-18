import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  currentUser: {},
  isAuth: false,
};


const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.currentUser = action.payload.user;
      state.isAuth = true;
    },
    logout: (state) => {
      localStorage.removeItem('token');
      state.currentUser = {};
      state.isAuth = false;
    }
  },
});

export const { setUser, logout } = userSlice.actions;
export default userSlice.reducer;
