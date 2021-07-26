import { useContext, useState } from 'react';

import web3 from '../../../connection/web3';
import Web3Context from '../../../store/web3-context';
import DaoContext from '../../../store/dao-context';

const CreateProposal = () => {
  const web3Ctx = useContext(Web3Context);
  const daoCtx = useContext(DaoContext);

  const [enteredName, setEnteredName] = useState('');
  const [nameIsValid, setNameIsValid] = useState(true);

  const [enteredAmount, setEnteredAmount] = useState('');
  const [amountIsValid, setAmountIsValid] = useState(true);

  const [enteredRecipient, setEnteredRecipient] = useState('');
  const [recipientIsValid, setRecipientIsValid] = useState(true);

  const formIsValid = enteredName && enteredAmount > 0 && web3.utils.isAddress(enteredRecipient);

  const nameChangeHandler = (event) => {
    setEnteredName(event.target.value);
  };

  const amountChangeHandler = (event) => {
    setEnteredAmount(event.target.value);
  };

  const recipientChangeHandler = (event) => {
    setEnteredRecipient(event.target.value);
  };
  
  const createProposalHandler = (event) => {
    event.preventDefault();

    enteredName ? setNameIsValid(true) : setNameIsValid(false);
    enteredAmount > 0 ? setAmountIsValid(true) : setAmountIsValid(false);
    web3.utils.isAddress(enteredRecipient) ? setRecipientIsValid(true) : setRecipientIsValid(false);

    if(formIsValid) {
      daoCtx.contract.methods.createProposal(enteredName, enteredAmount, enteredRecipient).send({from: web3Ctx.account})
      .on('transactionHash', (hash) => {
        setEnteredName('');
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

  const nameClass = nameIsValid? "form-control" : "form-control is-invalid";
  const amountClass = amountIsValid? "form-control" : "form-control is-invalid";
  const recipientClass = recipientIsValid? "form-control" : "form-control is-invalid";
  
  return(
    <div className="card border-primary text-white bg-secondary mb-4">
      <div className="card-header">
        <h2 className="text-center">Create proposal</h2>
      </div>
      <div className="card-body">  
        <form onSubmit={createProposalHandler}>
          <div className="row">
            <div className="col-md-4">
              <input 
                type="text" 
                className={nameClass} 
                placeholder="Proposal name..." 
                onChange={nameChangeHandler}
                value={enteredName}
              />
              {!nameIsValid ? <p className="text-danger"> Please, enter a name</p> : <p><br/></p>}
            </div>
            <div className="col-md-4">
              <input 
                type="text" 
                className={amountClass} 
                placeholder="Amount..." 
                onChange={amountChangeHandler}
                value={enteredAmount}
              />
              {!amountIsValid ? <p className="text-danger"> Please, enter a valid amount</p> : <p><br/></p>}
            </div>
            <div className="col-md-4">
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
  );
};

export default CreateProposal;