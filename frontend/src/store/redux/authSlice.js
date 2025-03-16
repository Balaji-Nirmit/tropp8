import { createSlice} from '@reduxjs/toolkit';

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    isAuthenticated: false,
  },
  reducers: {
    login:(state)=>{
      state.isAuthenticated=true
    },
    logout:(state)=>{
      state.isAuthenticated=false
    }
  }
});

export const authSliceActions = authSlice.actions;
export default authSlice;
