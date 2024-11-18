import { configureStore } from '@reduxjs/toolkit';
import storageReducer from './storageSlice';
import userReducer from './userSlice';

const store = configureStore({
  reducer: {
    storage: storageReducer,
    user: userReducer
  },
});

export default store;