import { useSelector, useDispatch } from "react-redux";

import { loadShares, loadTotalShares } from "../../../store/dao-actions";
import getDao from "../../../instances/contracts";

const Contribute = () => {
  const account = useSelector(state => state.web3.account);
  const networkId = useSelector(state => state.web3.networkId);
  const dao = getDao(networkId); 
  
  const dispatch = useDispatch();
  
  const contributeHandler = async(event) => {
    event.preventDefault();
    const amount = event.target.elements[0].value;
    await dao.methods.contribute().send({from: account, value: amount});
    dispatch(loadShares(account, dao));
    dispatch(loadTotalShares(dao));
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