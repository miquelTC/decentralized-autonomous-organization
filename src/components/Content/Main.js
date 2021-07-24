import MyShares from './MyShares/MyShares';
import WithdrawEther from './WithdrawEther/WithdrawEther';
import Contribute from './Contribute/Contribute';
import TransferShare from './TransferShare/TransferShare';
import RedeemShare from './RedeemShare/RedeemShare';
import CreateProposal from './Proposals/CreateProposal';
import Proposals from './Proposals/Proposals';
import img from '../../img/dao-img.png';

const Main = () => {
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
      <Proposals />
    </div>
  );
};

export default Main;