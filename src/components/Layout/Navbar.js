  
import logo from '../../img/logo.png'

const Navbar = (props) => {
  const connectWalletHandler = async() => {
    try {
      // Request account access
      await window.ethereum.request({ method: 'eth_requestAccounts' });
    } catch(error) {
      console.error(error);
    }

    // Load accounts
    const accounts = await props.web3.eth.getAccounts();
    props.setAccount(accounts[0]);
  };
  
  return (
    <nav className="navbar navbar-dark bg-primary p-0">
      <a className="navbar-brand" href="/#">
        <img src={logo} width="40" height="40" className="align-center" alt="logo" />
        mTC DAO
      </a>
      <ul className="navbar-nav px-3">
        <li className="nav-item">
          {props.account && 
            <a 
              className="nav-link small" 
              href={`https://etherscan.io/address/${props.account}`}
              target="blank"
              rel="noopener noreferrer"
            >
              {props.account}
            </a>}
          {!props.account && 
            <button 
              type="button" 
              className="btn btn-outline-light" 
              onClick={connectWalletHandler} 
            > 
              Connect your wallet
            </button>}
        </li>
      </ul>
    </nav>
  );  
};

export default Navbar;