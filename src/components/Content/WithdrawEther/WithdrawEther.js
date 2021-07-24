import React, { useContext } from "react";

import Web3Context from "../../../store/web3-context";
import DaoContext from "../../../store/dao-context";

const WithdrawEther = () => {
  const web3Ctx = useContext(Web3Context);
  const daoCtx = useContext(DaoContext);

  const withdrawHandler = async(event) => {
    event.preventDefault();
    const amount = event.target.elements[0].value;
    const to = event.target.elements[1].value;
    await daoCtx.contract.methods.withdrawEther(amount, to).send({from: web3Ctx.account});
    daoCtx.loadAvailableFunds(daoCtx.contract);
  };
  
  return(
    <React.Fragment>  
      {web3Ctx.account.toLowerCase() === daoCtx.admin.toLowerCase() ? (
        <div className="card border-primary text-white bg-secondary mb-4">
          <div className="card-header">
            <h2 className="text-center">Withdraw ether</h2>
          </div>
          <div className="card-body">            
            <form onSubmit={withdrawHandler}>
              <div className="row">
                <div className="form-group col-md-6 mb-3">
                  <input type="text" className="form-control" id="amount" placeholder="Amount..." />
                </div>
                <div className="form-group col-md-6 mb-3">
                  <input type="text" className="form-control" id="to" placeholder="To..." />
                </div>                
              </div>
              <button type="submit" className="btn btn-primary">Submit</button>
            </form>            
          </div>
        </div>      
      ) : null}
    </React.Fragment>  
  );
};

export default WithdrawEther;