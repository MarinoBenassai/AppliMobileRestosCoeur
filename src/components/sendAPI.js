import constantes from '../constantes';
import {checkFetch} from '../components/checkFetch';

export const sendAPI = async function (apCode, sqlCode, params, tokenCo) {
  let body = new FormData();
  body.append('params',JSON.stringify(params));
  if (apCode === 'APP') {
	body.append('token',tokenCo);
  }
  const response = await fetch('http://' + constantes.BDD + '/' + apCode + '/' + sqlCode + '/', {
	method: 'POST',
	body: body});
  return checkFetch(response,apCode);
}