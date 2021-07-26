import { useContext, useState } from 'react';

import Web3Context from '../../../store/web3-context';
import DaoContext from '../../../store/dao-context';

const Contribute = () => {
  const web3Ctx = useContext(Web3Context);
  const daoCtx = useContext(DaoContext);

  const [enteredAmount, setEnteredAmount] = useState('');
  const [amountIsValid, setAmountIsValid] = useState(true);
  
  const amountChangeHandler = (event) => {
    setEnteredAmount(event.target.value);
  };
  
  const contributeHandler = (event) => {
    event.preventDefault();

    enteredAmount > 0 ? setAmountIsValid(true) : setAmountIsValid(false);

    if(enteredAmount > 0) {      
      daoCtx.contract.methods.contribute().send({from: web3Ctx.account, value: enteredAmount})
      .on('transactionHash', (hash) => {
        setEnteredAmount('');
        daoCtx.setIsLoading(true);
      })
      .on('error', (error) => {
        window.alert('Something went wrong when pushing to the blockchain');
        daoCtx.setIsLoading(false);
      });
    }
  };
  
  const amountClass = amountIsValid? "form-control" : "form-control is-invalid";
  
  return(
    <div className="col-sm-4"> 
      <div className="card border-primary text-white bg-secondary mb-4">       
        <div className="card-header">
          <h2 className="text-center">Contribute</h2>
        </div>
        <div className="card-body">
          <form onSubmit={contributeHandler}>
            <input 
              type="text" 
              className={amountClass} 
              placeholder="Amount..." 
              onChange={amountChangeHandler} 
              value={enteredAmount} 
            />
            {!amountIsValid ? <p className="text-danger"> Please, enter a valid amount</p> : <p><br/></p>}
            <button type="submit" className="btn btn-primary">Submit</button>
          </form>
        </div>
      </div>
    </div> 
  );
};

export default Contribute;