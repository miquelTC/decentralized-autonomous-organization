import { useContext } from 'react';

import DaoContext from '../../../store/dao-context';
import { ProgressBar } from "react-bootstrap";

const MyShares = () => {
  const daoCtx = useContext(DaoContext);

  const now = daoCtx.totalShares > 0 ? ((daoCtx.shares / daoCtx.totalShares) * 100).toFixed(1) : 0;
  
  return(
    <div className="col-3">
      <h4 className="text-white mt-4">My Shares: {daoCtx.shares}</h4>      
      <ProgressBar now={now} label={`${now}%`} />;
    </div>
  );
};

export default MyShares;