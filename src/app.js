import React, { useEffect, useState } from 'react';

import web3 from './instances/connection';
import getDAO from './instances/contracts';

function App() {
  const [DAO, setDAO] = useState(null);
  const [account, setAccount] = useState(null);
  const [admin, setAdmin] = useState(null);
  const [shares, setShares] = useState([]);
  const [proposals, setProposals] = useState([]);
  const [isLoading, setIsLoading] = useState(true); 

  useEffect(() => {
    // Check if the user has Metamask active
    if(!web3) {
      window.alert('Non-Ethereum browser detected. You should consider trying MetaMask!');
      return;
    }
    
    // Function to fetch all the blockchain data
    const loadBlockchainData = async() => {
      // Request accounts acccess if needed
      try {
        await window.ethereum.request({ method: 'eth_requestAccounts' });  
      } catch(error) {
        console.error(error);
      }
      
      // Load account
      const accounts = await web3.eth.getAccounts();       
      setAccount(accounts[0]);

      // Network ID
      const networkId = await web3.eth.net.getId()

      // Contract
      const contract = getDAO(networkId);
      if(contract) {
        // Set contract in state
        setDAO(contract);

        // Get admin
        const admin = await contract.methods.admin().call();
        setAdmin(admin);

        // Upload shares and proposals
        uploadShares();
        uploadProposals();

        setIsLoading(false);
      } else {
        window.alert('DAO contract not deployed to detected network.')
      }
    };
    
    loadBlockchainData();
    
    // Metamask Event Subscription - Account changed
    window.ethereum.on('accountsChanged', (accounts) => {
      setAccount(accounts[0]);
    });

    // Metamask Event Subscription - Network changed
    window.ethereum.on('chainChanged', (chainId) => {
      window.location.reload();
    });
  }, []);

  async function updateShares() {
  }

  async function updateProposals() {
  }

  async function executeProposal(proposalId) {
  };

  async function withdrawEther(e) {
  };

  async function contribute(e) {
  };

  async function redeemShares(e) {
  };

  async function transferShares(e) {
  };

  async function vote(ballotId) {
  };

  async function createProposal(e) {
  };

  function isFinished(proposal) {
    const now = new Date().getTime();
    const proposalEnd =  new Date(parseInt(proposal.end) * 1000);
    return (proposalEnd > now) > 0 ? false : true;
  }

  if (!isReady()) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container">
      <h1 className="text-center">DAO</h1>

      <p>Shares: {shares}</p>

      {accounts[0].toLowerCase() === admin.toLowerCase() ? (
        <>
        <div className="row">
          <div className="col-sm-12">
            <h2>Withdraw ether</h2>
            <form onSubmit={e => withdrawEther(e)}>
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
          <form onSubmit={e => contribute(e)}>
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
          <form onSubmit={e => redeemShares(e)}>
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
          <form onSubmit={e => transferShares(e)}>
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
          <form onSubmit={e => createProposal(e)}>
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
              {proposals.map(proposal => (
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
                        onClick={e => vote(proposal.id)}
                        type="submit" 
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
                      admin.toLowerCase() === accounts[0].toLowerCase() ? (
                        <button 
                          onClick={e => executeProposal(proposal.id)}
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
}

export default App;