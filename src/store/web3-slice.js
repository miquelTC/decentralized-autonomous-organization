import { createSlice } from '@reduxjs/toolkit';

const web3Slice = createSlice({
  name: 'web3',
  initialState: {
     account: null,
     networkId: null
  },
  reducers: {
    getAccount(state, action) {
      state.account = action.payload;
    },
    getNetworkId(state, action) {
      state.networkId = action.payload;
    }
  }
});

export const web3Actions = web3Slice.actions;

export default web3Slice;