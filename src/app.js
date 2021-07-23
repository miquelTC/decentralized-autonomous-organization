import React, { useEffect, useState, useCallback } from 'react';
import { useDispatch } from 'react-redux';

import web3 from './instances/connection';
import getDAO from './instances/contracts';
import Navbar from './components/Layout/Navbar';
import Main from './components/Content/Main';
import Spinner from './components/Layout/Spinner';
import { loadShares, loadTotalShares } from './store/dao-actions';
import img from './img/dao-img.png';

function App() {
  const dispatch = useDispatch();
  
  
  
  
  const [DAO, setDAO] = useState(null);
  const [account, setAccount] = useState(null);
  const [admin, setAdmin] = useState(null);
  const [shares, setShares] = useState(null);
  const [totalShares, setTotalShares] = useState(null);
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
      const dao = getDAO(networkId);
      dispatch(loadShares(accounts[0], dao));
      dispatch(loadTotalShares(dao));
      const DAO = getDAO(networkId);
      if(DAO) {
        // Set contract in state
        setDAO(DAO);

        // Get admin
        const admin = await DAO.methods.admin().call();
        setAdmin(admin);

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

  const showContent = web3 && account && DAO && admin;

  const updateShares = useCallback(async() => {
    const shares = await DAO.methods.shares(account).call();
    setShares(shares);
    const totalShares = await DAO.methods.totalShares().call();
    setTotalShares(totalShares);
  }, [DAO, account]);

  const updateProposals = useCallback(async() => {
    const nextProposalId = parseInt(await DAO.methods.nextProposalId().call());
    const proposals = [];
    for(let i = 0; i < nextProposalId; i++) { 
      const [proposal, hasVoted] = await Promise.all([
        DAO.methods.proposals(i).call(),
        DAO.methods.votes(account, i).call()
      ]);
      proposals.push({...proposal, hasVoted});
    }
    setProposals(proposals);
  }, [DAO, account]);

  useEffect(() => {    
    if(showContent) {
      updateShares();
      updateProposals();
    }
  }, [showContent, updateShares, updateProposals]);

  const now = 60;
  
  return (
    <div className="bg-dark">
      <Navbar account={account} web3={web3} setAccount={setAccount} />
      <h1 className="text-center text-light mt-4">Decentralized Autonomous Organization</h1>      
      <img src={img} className="rounded mx-auto d-block mt-3 mb-3" width="120" height="120" alt="logo" />
      {showContent && !isLoading && 
        <Main 
          account={account} 
          DAO={DAO} 
          shares={shares} 
          totalShares={totalShares}
          admin={admin} 
          updateShares={updateShares} 
          proposals={proposals} 
          updateProposals={updateProposals} 
          isLoading={isLoading}  
        />
      }
      {!showContent && isLoading && <Spinner />}
    </div>
  );
}

export default App;