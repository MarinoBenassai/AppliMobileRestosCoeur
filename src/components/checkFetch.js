export const  checkFetch = async function(response, apCode = 'APP') {

    const type = response.headers.get('Content-Type');

    if( type == "application/json" ){
        const json = await response.json();
        
        if(response.ok){
            
			if (apCode === 'APP') {
              return Object.values(json.data);
			}
			else {
			  return json;
			}
        }
        else{
            throw json.error;
        }
        
    }

    var texte = await response.text();
    throw texte;
	
}