import React from 'react';

const DaoContext = React.createContext({
  contract: null,
  admin: null,
  shares: null,
  totalShares: null,
  availableFunds: null,
  proposals: [],
  loadContract: () => {},
  loadAdmin: () => {},
  loadShares: () => {},
  loadToalShares: () => {},
  loadAvailableFunds: () => {},
  loadProposals: () => {}
});

export default DaoContext;