import constantes from './src/constantes';

async function mockFetch(url, config) {

  const invalidToken = {
            ok: false,
            status: 404,
            json: async () => ({"error": "invalid token"}),
		    headers: {get: function(x) {if (x === 'Content-Type') return "application/json"}},
          }

  switch (url) {

    case constantes.BDD + '/AUT/AP_LOGIN/': {

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

    case constantes.BDD + '/APP/AP_UPD_NOTIF/': {
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
	
	case constantes.BDD + '/AUT/AP_RST_MOTDEPASSE/': {

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

    // Contact
    case constantes.ADDRESS + '/APP/AP_LST_CONTACT/': {
      const body = await JSON.parse(config.body);
	  if (body.params.P_IDBENEVOLE === 1005){
	    return {
          ok: true,
          status: 200,
          json: async () => ({"data":[{"jourdefaut":"Jeudi","nomactivite":"Pr\u00e9paration","nomsite":"Lalande","nom":"Haaaa","prenom":"Veeee","idbenevole":"212","telephone":"0000000000","email":"veeeee@hotmail.fr"},{"jourdefaut":"Jeudi","nomactivite":"Pr\u00e9paration","nomsite":"Lalande","nom":"eerdA","prenom":"Jolle","idbenevole":"276","telephone":"0000242","email":"ja@gmail.com"},{"jourdefaut":"Mercredi","nomactivite":"Pr\u00e9paration","nomsite":"Lalande","nom":"CIE","prenom":"Ges","idbenevole":"104","telephone":"0788888888","email":"g@free.fr"}]}),
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

    default: {

      throw new Error(`Unhandled request: ${url}`)

    }

  }

}

beforeAll(() => global.fetch = jest.fn().mockImplementation(mockFetch))

//beforeEach(() => global.fetch.mockImplementation(mockFetch))