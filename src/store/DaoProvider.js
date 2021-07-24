import React, { useReducer } from 'react';

import DaoContext from './dao-context';

const defaultDaoState = {
  loaded: null,
  admin: null,
  shares: null,
  totalShares: null,
  proposals: []
};

const daoReducer = (state, action) => {
  if(action.type === 'LOAD') {    
    return {
      loaded: true,
      admin: state.admin,
      shares: state.shares,
      totalShares: state.totalShares,
      proposals: state.proposals
    };
  } 
  
  if(action.type === 'ADMIN') {
    return {
      loaded: state.loaded,
      admin: action.admin,
      shares: state.shares,
      totalShares: state.totalShares,
      proposals: state.proposals
    };
  }

  if(action.type === 'SHARES') {    
    return {
      loaded: state.loaded,
      admin: state.admin,
      shares: action.shares,
      totalShares: state.totalShares,
      proposals: state.proposals
    };
  }

  if(action.type === 'TOTALSHARES') {    
    return {
      loaded: state.loaded,
      admin: state.admin,
      shares: state.shares,
      totalShares: action.totalShares,
      proposals: state.proposals
    };
  }

  if(action.type === 'PROPOSALS') {    
    return {
      loaded: state.loaded,
      admin: state.admin,
      shares: state.shares,
      totalShares: state.totalShares,
      proposals: action.proposals
    };
  }
  
  return defaultDaoState;
};

const DaoProvider = props => {
  const [DaoState, dispatchDaoAction] = useReducer(daoReducer, defaultDaoState);
  
  const loadHandler = () => {
    dispatchDaoAction({type: 'LOAD'}); 
  };

  const loadAdminHandler = async(dao) => {
    const admin = await dao.methods.admin().call();
    dispatchDaoAction({type: 'ADMIN', admin: admin});
  };

  const loadSharesHandler =async(account, dao) => {
    const shares = await dao.methods.shares(account).call();
    dispatchDaoAction({type: 'SHARES', shares: shares});
  };

  const loadTotalSharesHandler = async(dao) => {
    const totalShares = await dao.methods.totalShares().call();
    dispatchDaoAction({type: 'TOTALSHARES', totalShares: totalShares});
  };

  const loadProposalsHandler = async(account, dao) => {
    const nextProposalId = parseInt(await dao.methods.nextProposalId().call());
    const proposals = [];
    for(let i = 0; i < nextProposalId; i++) { 
      const [proposal, hasVoted] = await Promise.all([
        dao.methods.proposals(i).call(),
        dao.methods.votes(account, i).call()
      ]);
      proposals.push({...proposal, hasVoted});
    }  
    dispatchDaoAction({type: 'PROPOSALS', proposals: proposals});
  };
  
  const daoContext = {
    loaded: DaoState.loaded,
    admin: DaoState.admin,
    shares: DaoState.shares,
    totalShares: DaoState.totalShares,
    proposals: DaoState.proposals,
    load: loadHandler,
    loadAdmin: loadAdminHandler,
    loadShares: loadSharesHandler,
    loadTotalShares: loadTotalSharesHandler,
    loadProposals: loadProposalsHandler
  };
  
  return (
    <DaoContext.Provider value={daoContext}>
      {props.children}
    </DaoContext.Provider>
  );
};

export default DaoProvider;