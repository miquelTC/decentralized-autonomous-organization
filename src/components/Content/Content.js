import img from '../../img/dao-img.png';

const Content = (props) => {
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
  
  return(
    <div className="container">
      <h1 className="text-center">mTC DAO</h1>
      <img src={img} className="rounded mx-auto d-block mt-3" width="120" height="120" alt="logo" />

      <p>Shares: {props.shares}</p>

      {props.account.toLowerCase() === props.admin.toLowerCase() ? (
        <>
        <div className="row">
          <div className="col-sm-12">
            <h2>Withdraw ether</h2>
            <form onSubmit={withdrawEther}>
              <div className="form-group">
                <label htmlFor="amount">Amount</label>
                <input type="text" className="form-control" id="amount" />
              </div>
              <div className="form-group">
                <label htmlFor="to">To</label>
                <input type="text" className="form-control" id="to" />
              </div>
              <button type="submit" className="btn btn-primary">Submit</button>
            </form>
          </div>
        </div>
      <hr />
      </>
      ) : null}

      <div className="row">
        <div className="col-sm-12">
          <h2>Contribute</h2>
          <form onSubmit={contribute}>
            <div className="form-group">
              <label htmlFor="amount">Amount</label>
              <input type="text" className="form-control" id="amount" />
            </div>
            <button type="submit" className="btn btn-primary">Submit</button>
          </form>
        </div>
      </div>

      <hr/>

      <div className="row">
        <div className="col-sm-12">
          <h2>Redeem shares</h2>
          <form onSubmit={redeemShare}>
            <div className="form-group">
              <label htmlFor="amount">Amount</label>
              <input type="text" className="form-control" id="amount" />
            </div>
            <button type="submit" className="btn btn-primary">Submit</button>
          </form>
        </div>
      </div>

      <hr/>

      <div className="row">
        <div className="col-sm-12">
          <h2>Transfer shares</h2>
          <form onSubmit={transferShare}>
            <div className="form-group">
              <label htmlFor="amount">Amount</label>
              <input type="text" className="form-control" id="amount" />
            </div>
            <button type="submit" className="btn btn-primary">Submit</button>
          </form>
        </div>
      </div>

      <hr/>

      <div className="row">
        <div className="col-sm-12">
          <h2>Create proposal</h2>
          <form onSubmit={createProposal}>
            <div className="form-group">
              <label htmlFor="name">Name</label>
              <input type="text" className="form-control" id="name" />
            </div>
            <div className="form-group">
              <label htmlFor="amount">Amount</label>
              <input type="text" className="form-control" id="amount" />
            </div>
            <div className="form-group">
              <label htmlFor="recipient">Recipient</label>
              <input type="text" className="form-control" id="recipient" />
            </div>
            <button type="submit" className="btn btn-primary">Submit</button>
          </form>
        </div>
      </div>

      <hr/>

      <div className="row">
        <div className="col-sm-12">
          <h2>Proposals</h2>
          <table className="table">
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

export default Content;