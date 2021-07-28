import { useContext } from 'react';

import DaoContext from '../../../store/dao-context';

const AvailableFunds = () => {
  const daoCtx = useContext(DaoContext);
  
  return(    
    <div className="col-3 mt-3">
      <h4 className="text-white text-end">Available Funds: </h4>
      <h4 className="text-white text-end">{`${daoCtx.availableFunds} WEI`}</h4>
    </div>
  );
};

export default AvailableFunds;