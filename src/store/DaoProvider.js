import React, { useReducer, useCallback } from 'react';

import DaoContext from './dao-context';

const defaultDaoState = {
  contract: null,
  admin: null,
  shares: null,
  totalShares: null,
  proposals: [],
  isLoading: true
};

const daoReducer = (state, action) => {
  if(action.type === 'CONTRACT') {    
    return {
      contract: action.contract,
      admin: state.admin,
      shares: state.shares,
      totalShares: state.totalShares,
      availableFunds: state.availableFunds,
      proposals: state.proposals,
      isLoading: state.isLoading
    };
  } 
  
  if(action.type === 'ADMIN') {
    return {
      contract: state.contract,
      admin: action.admin,
      shares: state.shares,
      totalShares: state.totalShares,
      availableFunds: state.availableFunds,
      proposals: state.proposals,
      isLoading: state.isLoading
    };
  }

  if(action.type === 'SHARES') {    
    return {
      contract: state.contract,
      admin: state.admin,
      shares: action.shares,
      totalShares: state.totalShares,
      availableFunds: state.availableFunds,
      proposals: state.proposals,
      isLoading: state.isLoading
    };
  }

  if(action.type === 'UPDATESHARES') {    
    return {
      contract: state.contract,
      admin: state.admin,
      shares: action.shares,
      totalShares: state.totalShares,
      availableFunds: state.availableFunds,
      proposals: state.proposals,
      isLoading: state.isLoading
    };
  }

  if(action.type === 'TOTALSHARES') {    
    return {
      contract: state.contract,
      admin: state.admin,
      shares: state.shares,
      totalShares: action.totalShares,
      availableFunds: state.availableFunds,
      proposals: state.proposals,
      isLoading: state.isLoading
    };
  }

  if(action.type === 'UPDATETOTALSHARES') {    
    return {
      contract: state.contract,
      admin: state.admin,
      shares: state.shares,
      totalShares: action.totalShares,
      availableFunds: state.availableFunds,
      proposals: state.proposals,
      isLoading: state.isLoading
    };
  }

  if(action.type === 'AVAILABLEFUNDS') {    
    return {
      contract: state.contract,
      admin: state.admin,
      shares: state.shares,
      totalShares: state.totalShares,
      availableFunds: action.availableFunds,
      proposals: state.proposals,
      isLoading: state.isLoading
    };
  }

  if(action.type === 'UPDATEAVAILABLEFUNDS') {    
    return {
      contract: state.contract,
      admin: state.admin,
      shares: state.shares,
      totalShares: state.totalShares,
      availableFunds: action.availableFunds,
      proposals: state.proposals,
      isLoading: state.isLoading
    };
  }

  if(action.type === 'PROPOSALS') {    
    return {
      contract: state.contract,
      admin: state.admin,
      shares: state.shares,
      totalShares: state.totalShares,
      availableFunds: state.availableFunds,
      proposals: action.proposals,
      isLoading: state.isLoading
    };
  }

  if(action.type === 'UPDATEPROPOSALS') {    
    const proposals = [{...action.proposal, hasVoted: false}, ...state.proposals];
    return {
      contract: state.contract,
      admin: state.admin,
      shares: state.shares,
      totalShares: state.totalShares,
      availableFunds: state.availableFunds,
      proposals: proposals,
      isLoading: state.isLoading
    };
  }

  if(action.type === 'UPDATEVOTES') {    
    const proposals = state.proposals.map(proposal => {
      if(proposal.id === action.proposal.id) {
        proposal.votes = action.proposal.votes;
        proposal.hasVoted = true;
      }
      return proposal;
    });
    return {
      contract: state.contract,
      admin: state.admin,
      shares: state.shares,
      totalShares: state.totalShares,
      availableFunds: state.availableFunds,
      proposals: proposals,
      isLoading: state.isLoading
    };
  }

  if(action.type === 'UPDATEEXECUTEDPROPOSAL') {    
    const proposals = state.proposals.map(proposal => {
      if(proposal.id === action.proposal.id) {
        proposal.status = action.proposal.status;
      }
      return proposal;
    });
    return {
      contract: state.contract,
      admin: state.admin,
      shares: state.shares,
      totalShares: state.totalShares,
      availableFunds: state.availableFunds,
      proposals: proposals,
      isLoading: state.isLoading
    };
  }

  if(action.type === 'LOADING') {    
    return {
      contract: state.contract,
      admin: state.admin,
      shares: state.shares,
      totalShares: state.totalShares,
      availableFunds: state.availableFunds,
      proposals: state.proposals,
      isLoading: action.loading
    };
  }
  
  return defaultDaoState;
};

const DaoProvider = props => {
  const [DaoState, dispatchDaoAction] = useReducer(daoReducer, defaultDaoState);
  
  const loadContractHandler = (web3, DAO, deployedNetwork) => {
    const contract = deployedNetwork ? new web3.eth.Contract(DAO.abi, deployedNetwork.address): '';
    dispatchDaoAction({type: 'CONTRACT', contract: contract}); 
    return contract;
  };

  const loadAdminHandler = async(contract) => {
    const admin = await contract.methods.admin().call();
    dispatchDaoAction({type: 'ADMIN', admin: admin});
  };

  const loadSharesHandler = useCallback(async(account, contract) => {
    const shares = await contract.methods.shares(account).call();
    dispatchDaoAction({type: 'SHARES', shares: shares});
  }, []);

  const updateSharesHandler = (shares) => {
    dispatchDaoAction({type: 'UPDATESHARES', shares: shares});
  };

  const loadTotalSharesHandler = useCallback(async(contract) => {
    const totalShares = await contract.methods.totalShares().call();
    dispatchDaoAction({type: 'TOTALSHARES', totalShares: totalShares});
  }, []);

  const updateTotalSharesHandler = (totalShares) => {
    dispatchDaoAction({type: 'UPDATETOTALSHARES', totalShares: totalShares});
  };

  const loadAvailableFundsHandler = useCallback(async(contract) => {
    const availableFunds = await contract.methods.availableFunds().call();
    dispatchDaoAction({type: 'AVAILABLEFUNDS', availableFunds: availableFunds});
  }, []);

  const updateAvailableFundsHandler = (availableFunds) => {
    dispatchDaoAction({type: 'UPDATEAVAILABLEFUNDS', availableFunds: availableFunds});
  };

  const loadProposalsHandler = useCallback(async(account, contract) => {
    const nextProposalId = parseInt(await contract.methods.nextProposalId().call());
    const proposals = [];
    for(let i = nextProposalId - 1; i >= 0; i--) { 
      const [proposal, hasVoted] = await Promise.all([
        contract.methods.proposals(i).call(),
        contract.methods.votes(account, i).call()
      ]);
      proposals.push({...proposal, hasVoted});
    }  
    dispatchDaoAction({type: 'PROPOSALS', proposals: proposals});
  }, []);

  const updateProposalsHandler = (proposal) => {
    dispatchDaoAction({type: 'UPDATEPROPOSALS', proposal: proposal});
  };

  const updateVotesHandler = (proposal) => {
    dispatchDaoAction({type: 'UPDATEVOTES', proposal: proposal});
  };

  const updateExecutedProposalHandler = (proposal) => {
    dispatchDaoAction({type: 'UPDATEEXECUTEDPROPOSAL', proposal: proposal});
  };

  const setIsLoadingHandler = (loading) => {
    dispatchDaoAction({type: 'LOADING', loading: loading});
  };

  const daoContext = {
    contract: DaoState.contract,
    admin: DaoState.admin,
    shares: DaoState.shares,
    totalShares: DaoState.totalShares,
    availableFunds: DaoState.availableFunds,
    proposals: DaoState.proposals,
    isLoading: DaoState.isLoading,
    loadContract: loadContractHandler,
    loadAdmin: loadAdminHandler,
    loadShares: loadSharesHandler,
    updateShares: updateSharesHandler,
    loadTotalShares: loadTotalSharesHandler,
    updateTotalShares: updateTotalSharesHandler,
    loadAvailableFunds: loadAvailableFundsHandler,
    updateAvailableFunds: updateAvailableFundsHandler,
    loadProposals: loadProposalsHandler,
    updateProposals: updateProposalsHandler,
    updateVotes: updateVotesHandler,
    updateExecutedProposal: updateExecutedProposalHandler,
    setIsLoading: setIsLoadingHandler
  };
  
  return (
    <DaoContext.Provider value={daoContext}>
      {props.children}
    </DaoContext.Provider>
  );
};

export default DaoProvider;