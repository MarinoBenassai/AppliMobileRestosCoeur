import React, { useEffect, useState, useRef } from 'react';
import { ActivityIndicator, FlatList, Text, View, Pressable} from 'react-native';
import Icon from 'react-native-vector-icons/Octicons';
import styles from '../styles';
import {userContext} from '../contexts/userContext';

// Div status
function ViewStatus(props) {
    const status = props.status;
    const role = props.role;

    const id1=props.id1;
    const id2=props.id2;

    const align = props.align;

    const size = 32;
    const pad = 15;

    const fctStatut = props.fctStatut;
    const fctCommentaire = props.fctCommentaire;
	
	const commentaire = props.commentaire;

	const afficherInfoBulle = React.useContext(userContext).afficherInfoBulle;
	const cacherInfoBulle = React.useContext(userContext).cacherInfoBulle;
	const refBoutonComentaire = useRef(null);
	
    if(status == "Présent"){
        return (<View style={{justifyContent: "center", flexDirection: align, alignSelf: "center"}}>
            <Pressable onPress={(role=="2" || id1 == id2) ? fctStatut : ()=>{}}>
                {({ pressed }) => (
                    <Icon 
                        name='check' 
                        size={size}
                        color={pressed?'lightgreen':'green'}
                        style={styles.statusIcon}
                    />
                )}
            </Pressable>
        </View>);
    }
    else if( (status == "Absent") && ((role == "2") || id1 == id2) ) {
        return(<View style={{ justifyContent:"center", flexDirection: align, alignSelf: "center"}}>
            <Pressable onPress={fctCommentaire}
			onHoverIn = {() => {refBoutonComentaire.current.measure((x, y, width, height, pageX, pageY) => afficherInfoBulle(pageX, pageY,commentaire));}}
			onHoverOut = {cacherInfoBulle}
			ref = {refBoutonComentaire}>
                {({ pressed }) => (
                    <Icon 
                        name='note' 
                        size={size}
                        color={pressed?'darkslategrey':'black'}
                        style={styles.statusIcon}
                    />
                )}
            </Pressable>
            
            <Pressable onPress={fctStatut}>
                {({ pressed }) => (
                    <Icon 
                        name='x' 
                        size={size}
                        color={pressed?'orangered':'red'}
                        style={styles.statusIcon}
                    />
                )}
            </Pressable>
        
        </View>);
    }
    else if(status == "Absent") {
        return(<View  style={{justifyContent: "center", flexDirection: align, alignSelf: "center"}}>
            <Icon 
                name='x' 
                size={size}
                color='red'
                style={styles.statusIcon}
            />
        </View>);
    }
    else{
        return(<View style={{justifyContent: "center", flexDirection: align, alignSelf: "center"}}>
            <Pressable onPress={(role=="2" || id1 == id2) ? fctStatut : ()=>{}}>
                {({ pressed }) => (
                    <Icon 
                        name='unverified' 
                        size={size}
                        color={pressed?'darkslategrey':'black'}
                        style={styles.statusIcon}
                    />
                )}
            </Pressable>
        </View>);
    }
    
}

export default ViewStatus;