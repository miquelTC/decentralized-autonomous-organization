import React from 'react';

const DaoContext = React.createContext({
  contract: null,
  admin: null,
  shares: null,
  totalShares: null,
  proposals: [],
  loadContract: () => {},
  loadAdmin: () => {},
  loadShares: () => {},
  loadToalShares: () => {},
  loadProposals: () => {}
});

export default DaoContext;