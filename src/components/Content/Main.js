import MyShares from './MyShares/MyShares';
import WithdrawEther from './WithdrawEther/WithdrawEther';
import Contribute from './Contribute/Contribute';
import TransferShare from './TransferShare/TransferShare';
import RedeemShare from './RedeemShare/RedeemShare';
import CreateProposal from './Proposals/CreateProposal';
import img from '../../img/dao-img.png';

const Main = (props) => {



  

  const vote = async(event) => {
    await props.DAO.methods.vote(event.target.value).send({from: props.account});
    await props.updateProposals();
  };

  const executeProposal = async(event) => {
    await props.DAO.methods.executeProposal(event.target.value).send({from: props.account});
    await props.updateProposals();
  };

  const isFinished = (proposal) => {
    const now = new Date().getTime();
    const proposalEnd =  new Date(parseInt(proposal.end) * 1000);
    return ((proposalEnd - now) > 0 ? false : true);    
  }    


  return(
    <div className="container">
      <h1 className="text-center text-light mt-4">Decentralized Autonomous Organization</h1>      
      <img src={img} className="rounded mx-auto d-block mt-3 mb-3" width="120" height="120" alt="logo" />
      <MyShares />
      <WithdrawEther />
      <div className="row">
        <Contribute />
        <TransferShare />
        <RedeemShare />
      </div>
      <CreateProposal />
      

        


      {/* <div className="card border-primary text-white bg-secondary mb-4">
        <div className="card-header">
          <h2 className="text-center">Proposals</h2>
        </div>
        <div className="card-body">
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
              {props.proposals.map(proposal => (
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
                      props.admin.toLowerCase() === props.account.toLowerCase() ? (
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
      </div> */}
    </div>
  );
};

export default Main;