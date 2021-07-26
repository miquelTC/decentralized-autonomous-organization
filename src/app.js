import React, { useEffect, useContext } from 'react';

import DAO from './abis/DAO.json';
import web3 from './connection/web3';
import Navbar from './components/Layout/Navbar';
import Main from './components/Content/Main';
import Web3Context from './store/web3-context';
import DaoContext from './store/dao-context';
import Spinner from './components/Layout/Spinner';

function App() {
  const web3Ctx = useContext(Web3Context);
  const daoCtx = useContext(DaoContext);

  const { account, loadAccount, loadNetworkId } = web3Ctx;
  const { contract, loadContract, admin, loadAdmin, loadShares, updateShares, loadTotalShares, updateTotalShares, loadAvailableFunds, loadProposals, isLoading, setIsLoading } = daoCtx;

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
      loadAccount(web3);

      // Load Network ID
      const networkId = await loadNetworkId(web3);
      const deployedNetwork = DAO.networks[networkId];

      // Load contract
      const contract = loadContract(web3, DAO, deployedNetwork);
      if(contract) {
        // Load admin
        loadAdmin(contract);
        setIsLoading(false);

        // Subscribe to Shares Event
        contract.events.Shares({}, (error, event) => {
          updateShares(event.returnValues.shares);
          updateTotalShares(event.returnValues.totalShares);
          setIsLoading(false);
        });      
      } else {
        window.alert('DAO contract not deployed to detected network.')
      }
    };      
    
    loadBlockchainData();
    
    // Metamask Event Subscription - Account changed
    window.ethereum.on('accountsChanged', (accounts) => {
      loadAccount(web3);
    });

    // Metamask Event Subscription - Network changed
    window.ethereum.on('chainChanged', (chainId) => {
      window.location.reload();
    });
  }, []);

  const showContent = web3 && account && contract && admin;
  
  useEffect(() => {
    if(showContent) {      
      // Load Shares and Total Shares      
      loadShares(account, contract);
      loadTotalShares(contract);

      // Load Available Funds
      loadAvailableFunds(contract);

      // Load Proposals
      loadProposals(account, contract);
    }
  }, [showContent, account, contract, loadShares, loadTotalShares, loadAvailableFunds, loadProposals]);  
  
  return (    
    <div className="bg-dark">
      <Navbar />      
      {showContent && !isLoading && <Main />}
      {isLoading && <Spinner />}
    </div>
  );
};

export default App;