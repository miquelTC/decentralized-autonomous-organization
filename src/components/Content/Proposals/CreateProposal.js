import { useContext } from 'react';

import Web3Context from '../../../store/web3-context';
import DaoContext from '../../../store/dao-context';

const CreateProposal = () => {
  const web3Ctx = useContext(Web3Context);
  const daoCtx = useContext(DaoContext);
  
  const createProposalHandler = async(event) => {
    event.preventDefault();
    const name = event.target.elements[0].value;
    const amount = event.target.elements[1].value;
    const recipient = event.target.elements[2].value;
    await daoCtx.contract.methods.createProposal(name, amount, recipient).send({from: web3Ctx.account});
    await daoCtx.loadProposals(web3Ctx.account, daoCtx.contract);
  };
  
  return(
    <div className="card border-primary text-white bg-secondary mb-4">
      <div className="card-header">
        <h2 className="text-center">Create proposal</h2>
      </div>
      <div className="card-body">  
        <form onSubmit={createProposalHandler}>
          <div className="row">
            <div className="form-group col-md-4 mb-3">
              <input type="text" className="form-control" id="name" placeholder="Proposal name..." />
            </div>
            <div className="form-group col-md-4 mb-3">
              <input type="text" className="form-control" id="amount" placeholder="Amount..." />
            </div>
            <div className="form-group col-md-4 mb-3">
              <input type="text" className="form-control" id="recipient" placeholder="To..." />
            </div>              
          </div>
          <button type="submit" className="btn btn-primary">Submit</button>
        </form> 
    </div>         
  </div>
  );
};

export default CreateProposal;