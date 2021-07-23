import { configureStore } from '@reduxjs/toolkit';

import web3Slice from './web3-slice';
import daoSlice from './dao-slice';

const store = configureStore({
  reducer: {
    web3: web3Slice.reducer,
    dao: daoSlice.reducer
  }
});

export default store;