import React, { useEffect, useContext } from 'react';

import DAO from './abis/DAO.json';
import web3 from './connection/web3';
import Navbar from './components/Layout/Navbar';
import Main from './components/Content/Main';
import Web3Context from './store/web3-context';
import DaoContext from './store/dao-context';

function App() {
  const web3Ctx = useContext(Web3Context);
  const daoCtx = useContext(DaoContext);

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
      const account = await web3Ctx.loadAccount(web3);

      // Load Network ID
      const networkId = await web3Ctx.loadNetworkId(web3);
      const deployedNetwork = DAO.networks[networkId];

      // Load contract
      const contract = daoCtx.loadContract(web3, DAO, deployedNetwork);
      if(contract) {
        // Load admin
        daoCtx.loadAdmin(contract);

        // Load Shares and Total Shares
        daoCtx.loadShares(account, contract);
        daoCtx.loadTotalShares(contract);

        // Load Proposals
        daoCtx.loadProposals(account, contract);
        
      } else {
        window.alert('DAO contract not deployed to detected network.')
      }
    };      
    
    loadBlockchainData();
    
    // Metamask Event Subscription - Account changed
    window.ethereum.on('accountsChanged', (accounts) => {
      web3Ctx.loadAccount(web3);
    });

    // Metamask Event Subscription - Network changed
    window.ethereum.on('chainChanged', (chainId) => {
      window.location.reload();
    });
  }, []);

  const showContent = web3 && web3Ctx.account && daoCtx.contract && daoCtx.admin;
  
  return (    
    <div className="bg-dark">
      <Navbar />      
      {showContent && <Main />}
    </div>
  );
};

export default App;