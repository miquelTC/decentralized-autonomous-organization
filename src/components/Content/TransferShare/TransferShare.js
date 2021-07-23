import { useContext } from 'react';

import getDao from "../../../instances/contracts";
import Web3Context from '../../../store/web3-context';
import DaoContext from '../../../store/dao-context';

const TransferShare = () => {
  const web3Ctx = useContext(Web3Context);
  const daoCtx = useContext(DaoContext);

  const dao = getDao(web3Ctx.networkId); 
  
  const transferShareHandler = async(event) => {
    event.preventDefault();
    const amount = event.target.elements[0].value;
    const to = event.target.elements[1].value;
    await dao.methods.transferShare(amount, to).send({from: web3Ctx.account});
    daoCtx.loadShares(web3Ctx.account, dao);
    daoCtx.loadTotalShares(dao);
  };
  
  return(
    <div className="col-sm-4">
      <div className="card border-primary text-white bg-secondary mb-4">
        <div className="card-header">
          <h2 className="text-center">Transfer shares</h2>
        </div>
        <div className="card-body">
          <form onSubmit={transferShareHandler}>
            <div className="row">
              <div className="form-group col-md-6 mb-3">
                <input type="text" className="form-control" id="amount" placeholder="Amount..." />
              </div>
              <div className="form-group col-md-6 mb-3">
                <input type="text" className="form-control" id="recipient" placeholder="To..." />
              </div>
            </div>
            <button type="submit" className="btn btn-primary">Submit</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default TransferShare;