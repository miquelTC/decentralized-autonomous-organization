import { useContext, useState } from 'react';

import web3 from '../../../connection/web3';
import Web3Context from '../../../store/web3-context';
import DaoContext from '../../../store/dao-context';

const TransferShare = () => {
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
  
  const transferShareHandler = async(event) => {
    event.preventDefault();

    enteredAmount > 0 ? setAmountIsValid(true) : setAmountIsValid(false);
    web3.utils.isAddress(enteredRecipient) ? setRecipientIsValid(true) : setRecipientIsValid(false);

    if(formIsValid) {
      await daoCtx.contract.methods.transferShare(enteredAmount, enteredRecipient).send({from: web3Ctx.account});
      daoCtx.loadShares(web3Ctx.account, daoCtx.contract);
      daoCtx.loadTotalShares(daoCtx.contract);
      setEnteredAmount('');
      setEnteredRecipient('');
    }    
  };

  const amountClass = amountIsValid? "form-control" : "form-control is-invalid";
  const recipientClass = recipientIsValid? "form-control" : "form-control is-invalid";
  
  return(
    <div className="col-sm-4">
      <div className="card border-primary text-white bg-secondary mb-4">
        <div className="card-header">
          <h2 className="text-center">Transfer shares</h2>
        </div>
        <div className="card-body">
          <form onSubmit={transferShareHandler}>
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
    </div>
  );
};

export default TransferShare;