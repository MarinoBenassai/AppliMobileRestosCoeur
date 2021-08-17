import constantes from '../../constantes';
import {checkFetch} from '../../components/checkFetch';

export const sendAPI =   async (apCode,sqlCode,params, tokenCo = null) => {
  var body = {};
  if (apCode === 'APP') {
	body = JSON.stringify({
	  'params' : params,
	  'token' : tokenCo,
	});
  }
  else {
	body = JSON.stringify({
	  'params' : params,
	});
  }
  const response = await fetch(constantes.ADDRESS +  '/' + apCode + '/' + sqlCode + '/', {
	method: 'POST',
	body: body});
  return checkFetch(response,apCode);
};