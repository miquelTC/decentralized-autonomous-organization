import { daoActions } from './dao-slice';

export const loadAdmin = (dao) => {  
  return async(dispatch) => {
    const admin = await dao.methods.admin().call();
    dispatch(daoActions.getAdmin(admin));
  };
};

export const loadShares = (account, dao) => {  
  return async(dispatch) => {
    const shares = await dao.methods.shares(account).call();
    dispatch(daoActions.getShares(shares));
  };
};

export const loadTotalShares = (dao) => {  
  return async(dispatch) => {
    const shares = await dao.methods.totalShares().call();
    dispatch(daoActions.getTotalShares(shares));
  };
};

export const loadProposal = (account, dao) => {  
  return async(dispatch) => {
    const nextProposalId = parseInt(await dao.methods.nextProposalId().call());
    const proposals = [];
    for(let i = 0; i < nextProposalId; i++) { 
      const [proposal, hasVoted] = await Promise.all([
        dao.methods.proposals(i).call(),
        dao.methods.votes(account, i).call()
      ]);
      proposals.push({...proposal, hasVoted});
    }    
    dispatch(daoActions.getProposals(proposals));
  };
};

