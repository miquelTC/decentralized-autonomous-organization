import React, { useContext, useState } from "react";

import web3 from "../../../connection/web3";
import Web3Context from "../../../store/web3-context";
import DaoContext from "../../../store/dao-context";

const WithdrawEther = () => {
  const web3Ctx = useContext(Web3Context);
  const daoCtx = useContext(DaoContext);

  const [enteredAmount, setEnteredAmount] = useState('');
  const [amountIsValid, setAmountIsValid] = useState(true);

  const [enteredRecipient, setEnteredRecipient] = useState('');
  const [recipientIsValid, setRecipientIsValid] = useState(true);

  const formIsValid = enteredAmount > 0 && web3.utils.isAddress(enteredRecipient);

  const amountChangeHandler = (event) => {
    setEnteredAmount(event.target.value);
  };

  const recipientChangeHandler = (event) => {
    setEnteredRecipient(event.target.value);
  };

  const withdrawHandler = (event) => {
    event.preventDefault();

    enteredAmount > 0 ? setAmountIsValid(true) : setAmountIsValid(false);
    web3.utils.isAddress(enteredRecipient) ? setRecipientIsValid(true) : setRecipientIsValid(false);

    if(formIsValid) {
      daoCtx.contract.methods.withdrawEther(enteredAmount, enteredRecipient).send({from: web3Ctx.account})
      .on('transactionHash', (hash) => {
        setEnteredAmount('');
        setEnteredRecipient('');
        daoCtx.setIsLoading(true);
      })
      .on('error', (error) => {
        window.alert('Something went wrong when pushing to the blockchain');
        daoCtx.setIsLoading(false);
      });
    }    
  };

  const amountClass = amountIsValid? "form-control" : "form-control is-invalid";
  const recipientClass = recipientIsValid? "form-control" : "form-control is-invalid";
  
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
                <div className="col-md-6">
                  <input 
                    type="text" 
                    className={amountClass} 
                    placeholder="Amount..."
                    onChange={amountChangeHandler}
                    value={enteredAmount}
                  />
                  {!amountIsValid ? <p className="text-danger"> Please, enter a valid amount</p> : <p><br/></p>}
                </div>
                <div className="col-md-6">
                  <input 
                    type="text" 
                    className={recipientClass} 
                    placeholder="To..."
                    onChange={recipientChangeHandler}
                    value={enteredRecipient}
                  />
                  {!recipientIsValid ? <p className="text-danger"> Please, enter a valid address</p> : <p><br/></p>}
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