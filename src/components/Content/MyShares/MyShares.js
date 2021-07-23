import React from 'react';
import { useSelector } from 'react-redux';
import { ProgressBar } from "react-bootstrap";

const MyShares = () => {
  const shares = useSelector(state => state.dao.shares);
  const totalShares = useSelector(state => state.dao.totalShares);

  const now = ((shares / totalShares) * 100).toFixed(1);
  
  return(
    <React.Fragment>
      <h4 className="text-white mt-4">My Shares: {shares}</h4>
      <div className="col-2">
        <ProgressBar now={now} label={`${now}%`} />;
      </div>
    </React.Fragment>
  );
};

export default MyShares;