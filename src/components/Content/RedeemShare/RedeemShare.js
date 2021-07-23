import { useContext } from 'react';

import getDao from "../../../instances/contracts";
import Web3Context from '../../../store/web3-context';
import DaoContext from '../../../store/dao-context';

const RedeemShare = () => {
  const web3Ctx = useContext(Web3Context);
  const daoCtx = useContext(DaoContext);

  const dao = getDao(web3Ctx.networkId); 
  
  const redeemShareHandler = async(event) => {
    event.preventDefault();
    const amount = event.target.elements[0].value;
    await dao.methods.redeemShare(amount).send({from: web3Ctx.account});
    await daoCtx.loadShares(web3Ctx.account, dao);
  };
  
  return(    
    <div className="col-sm-4">
      <div className="card border-primary text-white bg-secondary mb-4">
        <div className="card-header">
          <h2 className="text-center">Redeem shares</h2>
        </div>
        <div className="card-body">
          <form onSubmit={redeemShareHandler}>
            <div className="form-group mb-3">
              <input type="text" className="form-control" id="amount" placeholder="Amount..." />
            </div>
            <button type="submit" className="btn btn-primary">Submit</button>
          </form>
        </div>
      </div>
    </div>    
  );
};

export default RedeemShare;