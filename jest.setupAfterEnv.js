import constantes from './src/constantes';
import data from './__tests__/data'

var engagementState = data.engagement1;

async function mockFetch(url, config) {

  const invalidToken = {
            ok: false,
            status: 404,
            json: async () => ({"error": "invalid token"}),
		    headers: {get: function(x) {if (x === 'Content-Type') return "application/json"}},
          }

  switch (url) {

    case constantes.ADDRESS + '/AUT/AP_LOGIN/': {

      const body = await JSON.parse(config.body)

	  if (body.params.email === 'a@a.a' && body.params.motDePasse === 'aaaaaaaa'){
	    return {
          ok: true,
          status: 200,
          json: async () => ({"token": "123456789","id": "1005" }),
		  headers: {get: function(x) {if (x === 'Content-Type') return "application/json"}},
        }
	  }
	  else {		  
        return {
          ok: false,
          status: 404,
          json: async () => ({"error": "Login ou mot de passe incorrect"}),
	      headers: {get: function(x) {if (x === 'Content-Type') return "application/json"}},
        }
	  }
    }

    case constantes.ADDRESS + '/APP/AP_UPD_NOTIF/': {
		const body = await JSON.parse(config.body) 
		
		if (body.token === "123456789") {
		  return {
            ok: true,
            status: 200,
            json: async () => ({"data":[0,1]}),
		    headers: {get: function(x) {if (x === 'Content-Type') return "application/json"}},
          }
		}
		else {
			return invalidToken;
		}
		
	}
	
	case constantes.ADDRESS + '/AUT/AP_RST_MOTDEPASSE/': {

      const body = await JSON.parse(config.body)

	  if (body.params.email === 'a@a.a') {
	    return {
          ok: true,
          status: 200,
          json: async () => ({"mdp": "nouveaumotdepasse" }),
		  headers: {get: function(x) {if (x === 'Content-Type') return "application/json"}},
        }
	  }
	  else {		  
        return {
          ok: true,
          status: 200,
          json: async () => (undefined),
	      headers: {get: function(x) {if (x === 'Content-Type') return "application/json"}},
        }
	  }
  }
	
	case constantes.ADDRESS + '/APP/AP_LST_PRE_BEN/':{

		const body = await JSON.parse(config.body)
		
		console.log("#############################################################################",body.token);
		
		switch (body.token){
			
			case 0: {
			  return {
			    ok: true,
			    status: 200,
			    json: async () => (data.engagement0),
			    headers: {get: function(x) {if (x === 'Content-Type') return "application/json"}},
			  }
			}
			
			case 1: {
			  return {
			    ok: true,
			    status: 200,
			    json: async () => (engagementState),
			    headers: {get: function(x) {if (x === 'Content-Type') return "application/json"}},
			  }
			}
		}
		


	}
	
	case constantes.ADDRESS + '/APP/AP_INS_PRESENCE/':{
		

		
		const body = await JSON.parse(config.body)
		console.log(body);
		if (body.params.P_IDBENEVOLE === 1005 
		&& body.params.P_JOURPRESENCE === '2021-08-23 00:00:00'
		&& body.params.P_IDACTIVITE === '3'
        && body.params.P_IDSITE === '2'
		&& body.params.P_IDROLE === '2'
		&& body.token === 1) 
		{
			console.log("@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@");
			engagementState = data.engagement2;		
		}
		else {
			throw new Error(`Incorrect request parameters`);	
		}

		return {
		  ok: true,
		  status: 200,
		  json: async () => ({"data":[1]}),
		  headers: {get: function(x) {if (x === 'Content-Type') return "application/json"}},	
		}

	}

  // Contact
  case constantes.ADDRESS + '/APP/AP_LST_CONTACT/': {
    const body = await JSON.parse(config.body);
  if (body.params.P_IDBENEVOLE === 0){
    return {
        ok: true,
        status: 200,
        json: async () => ({"data":[{"jourdefaut":"Jeudi","nomactivite":"Pr\u00e9paration","nomsite":"Lalande","nom":"Haaaa","prenom":"Veeee","idbenevole":"212","telephone":"0000000000","email":"veeeee@hotmail.fr"},{"jourdefaut":"Jeudi","nomactivite":"Pr\u00e9paration","nomsite":"Lalande","nom":"eerdA","prenom":"Jolle","idbenevole":"276","telephone":"0000242","email":"ja@gmail.com"},{"jourdefaut":"Mercredi","nomactivite":"Pr\u00e9paration","nomsite":"Lalande","nom":"CIE","prenom":"Ges","idbenevole":"104","telephone":"0788888888","email":"g@free.fr"}]}),
        headers: {get: function(x) {if (x === 'Content-Type') return "application/json"}},
      }
  }
  else if (body.params.P_IDBENEVOLE === 1){
    return {
        ok: false,
        status: 404,
        json: async () => ({"error": "contact erreur"}),
        headers: {get: function(x) {if (x === 'Content-Type') return "application/json"}},
      }
  }

  else {		  
      return {
        ok: false,
        status: 404,
        json: async () => ({"error": "contact...."}),
        headers: {get: function(x) {if (x === 'Content-Type') return "application/json"}},
      }
  }
  }

	
	case constantes.ADDRESS + '/APP/AP_CHECK_REFERENT/':{
		return {
		  ok: true,
		  status: 200,
		  json: async () => ({"data":[{"ref":"1"}]}),
		  headers: {get: function(x) {if (x === 'Content-Type') return "application/json"}},
		}
	}
	
	case constantes.ADDRESS + '/APP/AP_CHECK_RESPONSABLE/':{
		return {
		  ok: true,
		  status: 200,
		  json: async () => ({"data":[{"resp":"1"}]}),
		  headers: {get: function(x) {if (x === 'Content-Type') return "application/json"}},
		}
	}

  // Compte engagement défaut
  case constantes.ADDRESS + '/APP/AP_LST_ENG_BEN/': {

    const body = await JSON.parse(config.body)

    if (body.params.P_IDBENEVOLE === 0 || body.params.P_IDBENEVOLE === 1){ 
      return {
          ok: true,
          status: 200,
          json: async () => ({"data":[{"jourdefaut":"Lundi","nomactivite":"Distribution","nomsite":"Raisin","nomrole":"REFERENT","idengagement":"1009"},{"jourdefaut":"Lundi","nomactivite":"Tra\u00e7abilit\u00e9","nomsite":"Lalande","nomrole":"BENEVOLE","idengagement":"1672"}]}),
          headers: {get: function(x) {if (x === 'Content-Type') return "application/json"}},
        }
    }

  }

  // Compte info perso
  case constantes.ADDRESS + '/APP/AP_MON_COMPTE/': {

    const body = await JSON.parse(config.body)
    if (body.params.P_IDBENEVOLE === 0 || body.params.P_IDBENEVOLE === 1){ 
      return {
          ok: true,
          status: 200,
          json: async () => ({"data":[{"nom":"FT","prenom":"Ht","email":"h@f.fr","telephone":"8888888888","idbenevole":"1005"}]}),
          headers: {get: function(x) {if (x === 'Content-Type') return "application/json"}},
        }
    }

  }

  // Chnagement d'infos de contact
  case constantes.ADDRESS + '/AUT/AP_UPD_INFO_BENEVOLE/': {

    const body = await JSON.parse(config.body)

    if (body.params.P_TOKEN === 0){ 
      return {
          ok: true,
          status: 200,
          json: async () => ({"ok": "contact info" }),
          headers: {get: function(x) {if (x === 'Content-Type') return "application/json"}},
        }
    }

  }

  // Changement pwd
  case constantes.ADDRESS + '/AUT/AP_UPD_MOTDEPASSE/': {

    const body = await JSON.parse(config.body)
    
    if (body.params.idBenevole == 0){ 
      return {
          ok: true,
          status: 200,
          json: async () => ({"nbMod":1}),
          headers: {get: function(x) {if (x === 'Content-Type') return "application/json"}},
        }
    }
    else if (body.params.idBenevole == 1){ 
      return {
          ok: false,
          status: 401,
          json: async () => ({"error": "Ancien mot de passe incorrect."}),
          headers: {get: function(x) {if (x === 'Content-Type') return "application/json"}},
        }
    }

  }
  	case constantes.ADDRESS + '/APP/AP_CHECK_REFERENT/':{
		return {
		  ok: true,
		  status: 200,
		  json: async () => ({"data":[{"ref":"1"}]}),
		  headers: {get: function(x) {if (x === 'Content-Type') return "application/json"}},
		}
	}
	
	case constantes.ADDRESS + '/APP/AP_CHECK_RESPONSABLE/':{
		return {
		  ok: true,
		  status: 200,
		  json: async () => ({"data":[{"resp":"1"}]}),
		  headers: {get: function(x) {if (x === 'Content-Type') return "application/json"}},
		}
	}

  default: {
    throw new Error(`Unhandled request: ${url}`)

  }

  }

}

beforeAll(() => global.fetch = jest.fn().mockImplementation(mockFetch))

//beforeEach(() => global.fetch.mockImplementation(mockFetch))