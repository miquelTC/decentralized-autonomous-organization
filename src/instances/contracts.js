import web3 from './connection';
import DAO from '../abis/DAO.json';

//DAO contract
const getDao = (networkId) => {
  try {
    return new web3.eth.Contract(DAO.abi, DAO.networks[networkId].address);
  } catch(error) {
    console.log(error);
    return;
  }
};

export default getDao;