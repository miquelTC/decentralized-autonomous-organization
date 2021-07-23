import React, { useContext } from 'react';
import DaoContext from '../../../store/dao-context';
import { ProgressBar } from "react-bootstrap";

const MyShares = () => {
  const daoCtx = useContext(DaoContext);

  const now = ((daoCtx.shares / daoCtx.totalShares) * 100).toFixed(1);
  
  return(
    <React.Fragment>
      <h4 className="text-white mt-4">My Shares: {daoCtx.shares}</h4>
      <div className="col-2">
        <ProgressBar now={now} label={`${now}%`} />;
      </div>
    </React.Fragment>
  );
};

export default MyShares;