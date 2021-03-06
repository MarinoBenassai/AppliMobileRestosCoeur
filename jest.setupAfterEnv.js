import constantes from './src/constantes';
import data from './__tests__/data/data';

var engagementState = data.engagement1;
var compteInfoState = {"data":[{"nom":"FT","prenom":"Ht","email":"h@f.fr","telephone":"8888888888","idbenevole":"1005"}]};
var activiteBState = data.activiteB0;
var activiteRState = data.activiteR0;
var infoActiviteState = {"data":[]};

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
		
		if (body.params.P_IDBENEVOLE === 1005 
		&& body.params.P_JOURPRESENCE === '2021-09-06 00:00:00'
		&& body.params.P_IDACTIVITE === '3'
		&& body.params.P_IDSITE === '2'
		&& body.params.P_IDROLE === '2'
		&& body.token === 1) 
		{
			engagementState = data.engagement2;		
		}
		
		else if (body.params.P_IDBENEVOLE === '485'
		&& body.params.P_JOURPRESENCE === '2021-09-06'
		&& body.params.P_IDACTIVITE === '4'
		&& body.params.P_IDSITE === '1'
		&& body.params.P_IDROLE === '1'
		&& body.token === 1) 
		{
			activiteBState = data.activiteB1;		
		}
		
		else if (body.params.P_IDBENEVOLE === '1500'
		&& body.params.P_JOURPRESENCE === '2021-09-06'
		&& body.params.P_IDACTIVITE === '4'
		&& body.params.P_IDSITE === '1'
		&& body.params.P_IDROLE === '1'
		&& body.token === 2) 
		{
			activiteRState = data.activiteR1;		
		}
		
		else if(body.params.P_IDBENEVOLE == 27
		  && body.params.P_JOURPRESENCE == "2021-08-27"
		  && body.params.P_IDACTIVITE == "1"
		  && body.params.P_IDSITE == '1'
			  && body.params.P_IDROLE == '1'){
		  // juste pour ??viter le else
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
	
	case constantes.ADDRESS + '/APP/AP_UPD_PRESENCE/':{
		
		const body = await JSON.parse(config.body)

		if (body.params.P_IDBENEVOLE === 1005 
		&& body.params.P_JOURPRESENCE === '2021-09-06 00:00:00'
		&& body.params.P_IDACTIVITE === '3'
        && body.params.P_IDSITE === '2'
		&& body.params.P_COMMENTAIRE === "Ceci est un test ??*/????"
		&& body.token === 1) 
		{
			engagementState = data.engagement3;		
		}
		else if (body.params.P_IDBENEVOLE === '485'
		&& body.params.P_JOURPRESENCE === '2021-09-06'
		&& body.params.P_IDACTIVITE === '4'
        && body.params.P_IDSITE === '1'
		&& body.params.P_COMMENTAIRE === "Ceci est un test ??*##????"
		&& body.token === 1) 
		{
			activiteBState = data.activiteB2;		
		}
		else if (body.params.P_IDBENEVOLE === '1500'
		&& body.params.P_JOURPRESENCE === '2021-09-06'
		&& body.params.P_IDACTIVITE === '4'
        && body.params.P_IDSITE === '1'
		&& body.params.P_COMMENTAIRE === "Ceci est un autre test !!//..??"
		&& body.token === 2) 
		{
			activiteRState = data.activiteR2;		
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

	case constantes.ADDRESS + '/APP/AP_DEL_PRESENCE/':{
		
		const body = await JSON.parse(config.body)

		if (body.params.P_IDBENEVOLE === 1005 
		&& body.params.P_JOURPRESENCE === '2021-09-06 00:00:00'
		&& body.params.P_IDACTIVITE === '3'
        && body.params.P_IDSITE === '2'
		&& body.token === 1) 
		{
			engagementState = data.engagement4;		
		}
		
		if (body.params.P_IDBENEVOLE === '485' 
		&& body.params.P_JOURPRESENCE === '2021-09-06'
		&& body.params.P_IDACTIVITE === '4'
        && body.params.P_IDSITE === '1'
		&& body.token === 1) 
		{
			activiteBState = data.activiteB0;		
		}
		
		if (body.params.P_IDBENEVOLE === '1500' 
		&& body.params.P_JOURPRESENCE === '2021-09-06'
		&& body.params.P_IDACTIVITE === '4'
        && body.params.P_IDSITE === '1'
		&& body.token === 2) 
		{
			activiteRState = data.activiteR0;		
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

  // Compte engagement d??faut
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
          json: async () => (compteInfoState),
          headers: {get: function(x) {if (x === 'Content-Type') return "application/json"}},
        }
    }

  }

  // Chnagement d'infos de contact
  case constantes.ADDRESS + '/APP/AP_UPD_INFO_BENEVOLE/': {

    const body = await JSON.parse(config.body)
	compteInfoState = {"data":[{"nom":"FT","prenom":"Ht","email":body.params.P_EMAIL,"telephone":body.params.P_TELEPHONE,"idbenevole":"1005"}]};	

    if (body.params.P_TOKEN === 0){
		
      return {
          ok: true,
          status: 200,
          json: async () => ({"data": [1]}),
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

  // SynthRef
  case constantes.ADDRESS + '/APP/AP_LST_SYN_REF/': {

    const body = await JSON.parse(config.body);
    if (body.params.P_IDBENEVOLE == 0){ 
      return {
          ok: true,
          status: 200,
          json: async () => ({"data":[{"jourpresence":"2021-08-23 00:00:00","nomactivite":"Distribution","nomsite":"Raisin","nombre_present":"1","Tous_sites":"1","idactivite":"3","idsite":"2"},{"jourpresence":"2021-08-30 00:00:00","nomactivite":"Distribution","nomsite":"Raisin","nombre_present":"0","Tous_sites":"0","idactivite":"3","idsite":"2"}]}),
          headers: {get: function(x) {if (x === 'Content-Type') return "application/json"}},
        }
    }
    else if (body.params.P_IDBENEVOLE == 1){ 
      return {
          ok: true,
          status: 200,
          json: async () => ({"data":[]}),
          headers: {get: function(x) {if (x === 'Content-Type') return "application/json"}},
        }
    }
    
  }

  // SynthResp
  case constantes.ADDRESS + '/APP/AP_LST_SYN_RESP/': {

    const body = await JSON.parse(config.body);
    if (body.params.P_IDBENEVOLE == 0){ 
      return {
          ok: true,
          status: 200,
          json: async () => ({"data":[{"jourpresence":"2021-08-23 00:00:00","nomactivite":"Distribution","nomsite":"Raisin","nombre_present":"1","Tous_sites":"1","idactivite":"3","idsite":"2"},{"jourpresence":"2021-08-30 00:00:00","nomactivite":"Distribution","nomsite":"Raisin","nombre_present":"0","Tous_sites":"0","idactivite":"3","idsite":"2"}]}),
          headers: {get: function(x) {if (x === 'Content-Type') return "application/json"}},
        }
    }
    else if (body.params.P_IDBENEVOLE == 1){ 
      return {
          ok: true,
          status: 200,
          json: async () => ({"data":[]}),
          headers: {get: function(x) {if (x === 'Content-Type') return "application/json"}},
        }
    }
  }

  // Informations
  case constantes.ADDRESS + '/APP/AP_LST_INFO/': {

    const body = await JSON.parse(config.body);
    if (body.params.P_IDBENEVOLE == 0){ 
      return {
          ok: true,
          status: 200,
          json: async () => ({"data":[{"idactivite":"99","idrole":"99","commentaire":"Coll\u00e9giale : Liste de tous les b\u00e9n\u00e9voles","lien":"https:\/\/docs.googdeffg"},{"idactivite":"99","idrole":"99","commentaire":"Coll\u00e9giale : \u00e9tat des pr\u00e9sences","lien":"https:\/\/docs.going"}]}),
          headers: {get: function(x) {if (x === 'Content-Type') return "application/json"}},
        }
    }
  }

  // Liste B??n??vole
  case constantes.ADDRESS + '/APP/AP_ALL_BENEVOLE/': {

    const body = await JSON.parse(config.body);
    return {
        ok: true,
        status: 200,
        json: async () => ({"data":[{"prenom":"Aaaaa","nom":"Aa","email":"bedfg@gmail.com","telephone":"0544555","idbenevole":"27"},{"prenom":"Alis","nom":"AasdI","email":"wsdn@gmail.com","telephone":"0000006","idbenevole":"1703"},{"prenom":"Adfren","nom":"ZDFS","email":"azedf@hotmail.fr","telephone":"6000000","idbenevole":"1378"}]}),
        headers: {get: function(x) {if (x === 'Content-Type') return "application/json"}},
      }
  }

  //Activite

	case constantes.ADDRESS + '/APP/AP_LST_PRE_EQU/':{

		const body = await JSON.parse(config.body)
		
		switch (body.token){
			
			case 0: {
			  return {
			    ok: true,
			    status: 200,
			    json: async () => (data.activite0),
			    headers: {get: function(x) {if (x === 'Content-Type') return "application/json"}},
			  }
			}
			
			case 1: {
			  return {
			    ok: true,
			    status: 200,
			    json: async () => (activiteBState),
			    headers: {get: function(x) {if (x === 'Content-Type') return "application/json"}},
			  }
			}
			
			case 2: {

			  return {
			    ok: true,
			    status: 200,
			    json: async () => (activiteRState),
			    headers: {get: function(x) {if (x === 'Content-Type') return "application/json"}},
			  }
			}
		}
	}
	
	
	case constantes.ADDRESS + '/APP/AP_LST_SUIVI_ACTIVITE/':{

		const body = await JSON.parse(config.body)
		
		switch (body.token){
			
			case 0: {
			  return {
			    ok: true,
			    status: 200,
			    json: async () => (infoActiviteState),
			    headers: {get: function(x) {if (x === 'Content-Type') return "application/json"}},
			  }
			}
		}
	}

	case constantes.ADDRESS + '/APP/AP_INS_SUIVI_ACTIVITE/':{
		
		const body = await JSON.parse(config.body)

		if (body.params.P_JOUR === "2021-09-06"
		&& body.params.P_IDACTIVITE === '4'
		&& body.params.P_IDSITE === '1'
		&& body.params.P_NOMBREBENEFICIAIRE === '42'
		&& body.params.P_COMMENTAIRE === 'Ceci est un test **//??&)'
		&& body.token === 0) 
		{
			infoActiviteState = {"data": [{"nombre_beneficiaire": "42","commentaire": "Ceci est un test **//??&)"}]};		
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

	case constantes.ADDRESS + '/APP/AP_UPD_SUIVI_ACTIVITE/':{
		const body = await JSON.parse(config.body)

		if (body.params.P_JOUR === "2021-09-06"
		&& body.params.P_IDACTIVITE === '4'
		&& body.params.P_IDSITE === '1'
		&& body.params.P_NOMBREBENEFICIAIRE === '42'
		&& body.params.P_COMMENTAIRE === 'Ceci est un autre test ..~~????'
		&& body.token === 0) 
		{
			infoActiviteState = {"data": [{"nombre_beneficiaire": "42","commentaire": "Ceci est un autre test ..~~????"}]};		
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
	
  default: {
    throw new Error(`Unhandled request: ${url}`)

  }

  }

}

beforeAll(() => global.fetch = jest.fn().mockImplementation(mockFetch))

beforeEach(() => {
	jest.setTimeout(30000);
	compteInfoState = {"data":[{"nom":"FT","prenom":"Ht","email":"h@f.fr","telephone":"8888888888","idbenevole":"1005"}]};
	engagementState = data.engagement1;
});

//beforeEach(() => global.fetch.mockImplementation(mockFetch))