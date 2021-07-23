import { useSelector, useDispatch } from "react-redux";

import { loadShares, loadTotalShares } from "../../../store/dao-actions";
import getDao from "../../../instances/contracts";

const TransferShare = () => {
  const account = useSelector(state => state.web3.account);
  const networkId = useSelector(state => state.web3.networkId);
  const dao = getDao(networkId); 

  const dispatch = useDispatch();
  
  const transferShareHandler = async(event) => {
    event.preventDefault();
    const amount = event.target.elements[0].value;
    const to = event.target.elements[1].value;
    await dao.methods.transferShare(amount, to).send({from: account});
    dispatch(loadShares(account, dao));
    dispatch(loadTotalShares(dao));
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