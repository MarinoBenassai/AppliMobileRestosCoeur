import React, { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, Text, View} from 'react-native';
import Icon from 'react-native-vector-icons/Octicons';
import styles from '../styles';

// Div status
function ViewStatus(props) {
    const status = props.status;
    const role = props.role;

    const align = props.align;

    const size = 32;
    const pad = 15;

    const fctStatut = props.fctStatut;
    const fctCommentaire = props.fctCommentaire;

    if(status == "Présent"){
        return (<View style={{justifyContent: "center"}}>
            <Icon 
                name='check' 
                size={size}
                color='green'
                onPress={role=="2" ? fctStatut : ()=>{}}
                style={styles.statusIcon}
            />
        </View>);
    }
    else if( (status == "Absent") && (role == "2") ) {
        return(<View style={{ justifyContent:"center", flexDirection: align, alignSelf: "center"}}>
            <Icon 
                name='note' 
                size={size}
                color='black'
                onPress={fctCommentaire}
                style={styles.statusIcon}
            />
            
            <Icon 
                name='x' 
                size={size}
                color='red'
                onPress={fctStatut}
                style={styles.statusIcon}
            />
        
        </View>);
    }
    else if(status == "Absent") {
        return(<View  style={{justifyContent: "center"}}>
            <Icon 
                name='x' 
                size={size}
                color='red'
                style={styles.statusIcon}
            />
        
        </View>);
    }
    else{
        return(<View style={{justifyContent: "center"}}>
            <Icon 
                name='unverified' 
                size={size}
                color='black'
                onPress={role=="2" ? fctStatut : ()=>{}}
                style={styles.statusIcon}
            />
        </View>);
    }
    
}

export default ViewStatus;