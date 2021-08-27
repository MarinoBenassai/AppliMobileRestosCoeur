import constantes from '../constantes';
import {checkFetch} from '../components/checkFetch';

export const sendAPI = async function (apCode, sqlCode, params, tokenCo) {

  let body = new FormData();
  body.append('params',JSON.stringify(params));
  if (apCode === 'APP') {
	  body.append('token',tokenCo);
  }

  const response = await fetch(constantes.ADDRESS + '/' + apCode + '/' + sqlCode + '/', {
	  method: 'POST',
	  body: body})
  .catch((error) => {throw "Connexion avec le serveur perdue";});


  return checkFetch(response,apCode);
}