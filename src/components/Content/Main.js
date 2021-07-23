import { ProgressBar } from "react-bootstrap";

const Main = (props) => {
  const withdrawEther = async(event) => {
    event.preventDefault();
    const amount = event.target.elements[0].value;
    const to = event.target.elements[1].value;
    await props.DAO.methods.withdraw(amount, to).send({from: props.account});
  };

  const contribute = async(event) => {
    event.preventDefault();
    const amount = event.target.elements[0].value;
    await props.DAO.methods.contribute().send({from: props.account, value: amount});
    await props.updateShares();  };

  const redeemShare = async(event) => {
    event.preventDefault();
    const amount = event.target.elements[0].value;
    await props.DAO.methods.redeemShare(amount).send({from: props.account});
    await props.updateShares();
  };

  const transferShare = async(event) => {
    event.preventDefault();
    const amount = event.target.elements[0].value;
    const to = event.target.elements[1].value;
    await props.DAO.methods.transferShare(amount, to).send({from: props.account});
    await props.updateShares();
  };

  const createProposal = async(event) => {
    event.preventDefault();
    const name = event.target.elements[0].value;
    const amount = event.target.elements[1].value;
    const recipient = event.target.elements[2].value;
    await props.DAO.methods.createProposal(name, amount, recipient).send({from: props.account});
    await props.updateProposals();
  };

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
  
  const now = ((props.shares / props.totalShares) * 100).toFixed(1);

  return(
    <div className="container">
      <h4 className="text-white mt-4">My Shares: {props.shares}</h4>
      <div className="col-2">
        <ProgressBar now={now} label={`${now}%`} />;
      </div>

      {props.account.toLowerCase() === props.admin.toLowerCase() ? (
        <>
        <div className="card border-primary text-white bg-secondary mb-4">
          <div className="card-header">
            <h2 className="text-center">Withdraw ether</h2>
          </div>
          <div className="card-body">            
            <form onSubmit={withdrawEther}>
              <div className="row">
                <div className="form-group col-md-6 mb-3">
                  {/* <label htmlFor="amount">Amount</label> */}
                  <input type="text" className="form-control" id="amount" placeholder="Amount..." />
                </div>
                <div className="form-group col-md-6 mb-3">
                  {/* <label htmlFor="to">To</label> */}
                  <input type="text" className="form-control" id="to" placeholder="To..." />
                </div>                
              </div>
              <button type="submit" className="btn btn-primary">Submit</button>
            </form>
            
          </div>

          </div>
        
      
      </>
      ) : null}

      
      <div className="row">      
        <div className="col-sm-4">
          <div className="card border-primary text-white bg-secondary mb-4">
            <div className="card-header">
              <h2 className="text-center">Contribute</h2>
            </div>
            <div className="card-body">
              <form onSubmit={contribute}>
                <div className="form-group mb-3">
                  {/* <label htmlFor="amount">Amount</label> */}
                  <input type="text" className="form-control" id="amount" placeholder="Amount..." />
                </div>
                <button type="submit" className="btn btn-primary">Submit</button>
              </form>
            </div>
          </div>
        </div>  

        <div className="col-sm-4">
          <div className="card border-primary text-white bg-secondary mb-4">
            <div className="card-header">
              <h2 className="text-center">Transfer shares</h2>
            </div>
            <div className="card-body">
              <form onSubmit={transferShare}>
                <div className="row">
                  <div className="form-group col-md-6 mb-3">
                    {/* <label htmlFor="amount">Amount</label> */}
                    <input type="text" className="form-control" id="amount" placeholder="Amount..." />
                  </div>
                  <div className="form-group col-md-6 mb-3">
                    {/* <label htmlFor="amount">Amount</label> */}
                    <input type="text" className="form-control" id="recipient" placeholder="To..." />
                  </div>
                </div>
                <button type="submit" className="btn btn-primary">Submit</button>
              </form>
            </div>
          </div>
        </div>

        <div className="col-sm-4">
          <div className="card border-primary text-white bg-secondary mb-4">
            <div className="card-header">
              <h2 className="text-center">Redeem shares</h2>
            </div>
            <div className="card-body">
              <form onSubmit={redeemShare}>
                <div className="form-group mb-3">
                  {/* <label htmlFor="amount">Amount</label> */}
                  <input type="text" className="form-control" id="amount" placeholder="Amount..." />
                </div>
                <button type="submit" className="btn btn-primary">Submit</button>
              </form>
            </div>
          </div>
        </div> 
      </div>

        
      <div className="card border-primary text-white bg-secondary mb-4">
        <div className="card-header">
          <h2 className="text-center">Create proposal</h2>
        </div>
        <div className="card-body">  
          <form onSubmit={createProposal}>
            <div className="row">
              <div className="form-group col-md-4 mb-3">
                {/* <label htmlFor="name">Name</label> */}
                <input type="text" className="form-control" id="name" placeholder="Proposal name..." />
              </div>
              <div className="form-group col-md-4 mb-3">
                {/* <label htmlFor="amount">Amount</label> */}
                <input type="text" className="form-control" id="amount" placeholder="Amount..." />
              </div>
              <div className="form-group col-md-4 mb-3">
                {/* <label htmlFor="recipient">Recipient</label> */}
                <input type="text" className="form-control" id="recipient" placeholder="To..." />
              </div>              
            </div>
            <button type="submit" className="btn btn-primary">Submit</button>
          </form> 
        </div>         
      </div>

      <div className="card border-primary text-white bg-secondary mb-4">
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
      </div>
    </div>
  );
};

export default Main;