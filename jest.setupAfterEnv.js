import constantes from './src/constantes';

const engagementInit = {
	"data": [
		{
			"jourpresence": "2021-08-16 00:00:00",
			"nomactivite": "Distribution",
			"nomsite": "Raisin",
			"nomrole": "REFERENT",
			"etat": "Absent",
			"commentaire": "",
			"nombre_present": "4",
			"jour": "Lundi",
			"idpresence": "261",
			"idactivite": "3",
			"idsite": "2",
			"idrole": "2"
		},
		{
			"jourpresence": "2021-08-16 00:00:00",
			"nomactivite": "Traçabilité",
			"nomsite": "Lalande",
			"nomrole": "BENEVOLE",
			"etat": "Présent",
			"commentaire": "",
			"nombre_present": "2",
			"jour": "Lundi",
			"idpresence": "169",
			"idactivite": "4",
			"idsite": "1",
			"idrole": "1"
		},
		{
			"jourpresence": "2021-08-23 00:00:00",
			"nomactivite": "Distribution",
			"nomsite": "Raisin",
			"nomrole": "REFERENT",
			"etat": "Absent",
			"commentaire": "",
			"nombre_present": "3",
			"jour": "Lundi",
			"idpresence": "252",
			"idactivite": "3",
			"idsite": "2",
			"idrole": "2"
		},
		{
			"jourpresence": "2021-08-23 00:00:00",
			"nomactivite": "Traçabilité",
			"nomsite": "Lalande",
			"nomrole": "BENEVOLE",
			"etat": "Absent",
			"commentaire": "",
			"nombre_present": "1",
			"jour": "Lundi",
			"idpresence": "253",
			"idactivite": "4",
			"idsite": "1",
			"idrole": "1"
		},
		{
			"jourpresence": "2021-08-30 00:00:00",
			"nomactivite": "Distribution",
			"nomsite": "Raisin",
			"nomrole": "REFERENT",
			"etat": "Absent",
			"commentaire": "",
			"nombre_present": "3",
			"jour": "Lundi",
			"idpresence": "251",
			"idactivite": "3",
			"idsite": "2",
			"idrole": "2"
		},
		{
			"jourpresence": "2021-08-30 00:00:00",
			"nomactivite": "Traçabilité",
			"nomsite": "Lalande",
			"nomrole": "BENEVOLE",
			"etat": "Non défini",
			"commentaire": "",
			"nombre_present": "1",
			"jour": "Lundi",
			"idpresence": null,
			"idactivite": "4",
			"idsite": "1",
			"idrole": "1"
		},
		{
			"jourpresence": "2021-09-06 00:00:00",
			"nomactivite": "Distribution",
			"nomsite": "Raisin",
			"nomrole": "REFERENT",
			"etat": "Absent",
			"commentaire": "congés",
			"nombre_present": "0",
			"jour": "Lundi",
			"idpresence": "193",
			"idactivite": "3",
			"idsite": "2",
			"idrole": "2"
		},
		{
			"jourpresence": "2021-09-06 00:00:00",
			"nomactivite": "Traçabilité",
			"nomsite": "Lalande",
			"nomrole": "BENEVOLE",
			"etat": "Absent",
			"commentaire": "congés",
			"nombre_present": "0",
			"jour": "Lundi",
			"idpresence": "194",
			"idactivite": "4",
			"idsite": "1",
			"idrole": "1"
		}
	]
}


async function mockFetch(url, config) {

  const invalidToken = {
            ok: false,
            status: 404,
            json: async () => ({"error": "invalid token"}),
		    headers: {get: function(x) {if (x === 'Content-Type') return "application/json"}},
          }
  console.log(url);
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

    

		//if (body.token !== body.params.P_IDBENEVOLE) {
		//	throw new Error(`Unhandled request: ${url}`);
		//}
		
		//switch (body.token) {
			
		//	case '1005': {
				
				
				return {
				  ok: true,
				  status: 200,
				  json: async () => (engagementInit),
				  headers: {get: function(x) {if (x === 'Content-Type') return "application/json"}},
				}
				
				
		//	}
			
		//}

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