import React from "react";
import { useSelector } from "react-redux";

import getDao from '../../../instances/contracts';

const WithdrawEther = () => {
  const account = useSelector(state => state.web3.account);
  const admin = useSelector(state => state.dao.admin);
  const networkId = useSelector(state => state.web3.networkId);
  const dao = getDao(networkId);

  const withdrawHandler = async(event) => {
    event.preventDefault();
    const amount = event.target.elements[0].value;
    const to = event.target.elements[1].value;
    await dao.methods.withdraw(amount, to).send({from: account});
  };
  
  return(
    <React.Fragment>  
      {account.toLowerCase() === admin.toLowerCase() ? (
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