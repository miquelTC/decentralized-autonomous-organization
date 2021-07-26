import React from 'react';

const DaoContext = React.createContext({
  contract: null,
  admin: null,
  shares: null,
  totalShares: null,
  availableFunds: null,
  proposals: [],
  isLoading: null,
  loadContract: () => {},
  loadAdmin: () => {},
  loadShares: () => {},
  updateShares: () => {},
  loadToalShares: () => {},
  updateTotalShares: () => {},
  loadAvailableFunds: () => {},
  updateAvailableFunds: () => {},
  loadProposals: () => {},
  updateProposals: () => {},
  updateVotes: () => {},
  updateExecutedProposal: () => {},
  setIsLoading: () => {}
});

export default DaoContext;