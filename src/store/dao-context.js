import React from 'react';

const DaoContext = React.createContext({
  loaded: null,
  admin: null,
  shares: null,
  totalShares: null,
  proposals: [],
  load: () => {},
  loadAdmin: () => {},
  loadShares: () => {},
  loadToalShares: () => {},
  loadProposals: () => {}
});

export default DaoContext;