import { useContext } from 'react';

import Web3Context from '../../../store/web3-context';
import DaoContext from '../../../store/dao-context';

const Contribute = () => {
  const web3Ctx = useContext(Web3Context);
  const daoCtx = useContext(DaoContext);
  
  const contributeHandler = async(event) => {
    event.preventDefault();
    const amount = event.target.elements[0].value;
    await daoCtx.contract.methods.contribute().send({from: web3Ctx.account, value: amount});
    daoCtx.loadShares(web3Ctx.account, daoCtx.contract);
    daoCtx.loadTotalShares(daoCtx.contract);
  };
  
  return(
    <div className="col-sm-4"> 
      <div className="card border-primary text-white bg-secondary mb-4">       
        <div className="card-header">
          <h2 className="text-center">Contribute</h2>
        </div>
        <div className="card-body">
          <form onSubmit={contributeHandler}>
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

export default Contribute;