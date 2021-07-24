import { useContext } from 'react';

import getDao from "../../../instances/contracts";
import Web3Context from '../../../store/web3-context';
import DaoContext from '../../../store/dao-context';

const Proposals = () => {
  const web3Ctx = useContext(Web3Context);
  const daoCtx = useContext(DaoContext);

  const dao = getDao(web3Ctx.networkId); 
  
  const vote = async(event) => {
    await dao.methods.vote(event.target.value).send({from: web3Ctx.account});
    await daoCtx.loadProposals(web3Ctx.account, dao);
  };

  const executeProposal = async(event) => {
    await dao.methods.executeProposal(event.target.value).send({from: web3Ctx.account});
    await daoCtx.loadProposals(web3Ctx.account, dao);
  };

  const isFinished = (proposal) => {
    const now = new Date().getTime();
    const proposalEnd =  new Date(parseInt(proposal.end) * 1000);
    return ((proposalEnd - now) > 0 ? false : true);    
  };
  
  return(
    <div className="card border-primary text-white bg-secondary mb-4">
      <div className="card-header">
        <h2 className="text-center">Proposals</h2>
      </div>
      <div className="card-body table-responsive">
        <table className="table text-white">
          <thead>
            <tr>
              <th>Id</th>
              <th>Name</th>
              <th>Amount</th>
              <th>Recipient</th>
              <th>Votes</th>
              <th>Vote</th>
              <th>Ends on</th>
              <th>Executed</th>
            </tr>
          </thead>
          <tbody>
            {daoCtx.proposals.map(proposal => (
              <tr key={proposal.id}>
                <td>{proposal.id}</td>
                <td>{proposal.name}</td>
                <td>{proposal.amount}</td>
                <td>{proposal.recipient}</td>
                <td>{proposal.votes}</td>
                <td>
                  {isFinished(proposal) ? 'Vote finished' : (
                    proposal.hasVoted ? 'You already voted' : ( 
                    <button 
                      value={proposal.id}  
                      onClick={vote}
                      type="button" 
                      className="btn btn-primary">
                      Vote
                    </button>
                  ))}
                </td>
                <td>
                  {(new Date(parseInt(proposal.end) * 1000)).toLocaleString()}
                </td>
                <td>
                  {proposal.executed ? 'Yes' : (
                    daoCtx.admin.toLowerCase() === web3Ctx.account.toLowerCase() ? (
                      <button 
                        value={proposal.id}  
                        onClick={executeProposal}
                        type="submit" 
                        className="btn btn-primary">
                        Execute
                      </button>
                    ) : 'No' 
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        </div>
        </div>

  );
};

export default Proposals;