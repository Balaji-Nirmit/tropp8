import { configureStore } from "@reduxjs/toolkit";
import authSlice from "./authSlice";

const storeIndex=configureStore({
    reducer:{
        auth:authSlice.reducer,
    }
})
export default storeIndex;