import React, { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, Text, View} from 'react-native';
import Icon from 'react-native-vector-icons/Octicons';

// Div status
function ViewStatus(props) {
    const status = props.status;
    const role = props.role;

    const align = props.align;

    const size = 32;
    const pad = 30;

    const fctStatut = props.fctStatut;
    const fctCommentaire = props.fctCommentaire;

    if(status == "Présent"){
        return (<View>
            <Icon 
                name='check' 
                size={size}
                color='green'
                onPress={role=="2" ? fctStatut : ()=>{}}
                style={{paddingRight: pad}}
            />
        </View>);
    }
    else if( (status == "Absent") && (role == "2") ) {
        return(<View style={{ justifyContent:"space-evenly", flexDirection: align}}>
            <Icon 
                name='x' 
                size={size}
                color='red'
                onPress={fctStatut}
                style={{paddingRight: pad}}
            />
        
            <Icon 
                name='note' 
                size={size}
                color='black'
                onPress={fctCommentaire}
                style={{paddingRight: pad}}
            />
        </View>);
    }
    else if(status == "Absent") {
        return(<View>
            <Icon 
                name='x' 
                size={size}
                color='red'
                style={{paddingRight: pad}}
            />
        
        </View>);
    }
    else{
        return(<View>
            <Icon 
                name='unverified' 
                size={size}
                color='black'
                onPress={role=="2" ? fctStatut : ()=>{}}
                style={{paddingRight: pad}}
            />
        </View>);
    }
    
}

export default ViewStatus;