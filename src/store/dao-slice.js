import { createSlice } from '@reduxjs/toolkit';

const daoSlice = createSlice({
  name: 'dao',
  initialState: {
    loaded: false,
    admin: null,
    shares: null,
    totalShares: null,
    proposals: []
  },
  reducers: {
    loaded(state, action) {
      state.loaded = action.payload;
    },
    getAdmin(state, action) {
      state.admin = action.payload;
    },
    getShares(state, action) {
      state.shares = action.payload;
    },
    getTotalShares(state, action) {
      state.totalShares = action.payload;
    },
    getProposals(state, action) {
      state.Proposals = action.payload;
    }
  }
});

export const daoActions = daoSlice.actions;

export default daoSlice;