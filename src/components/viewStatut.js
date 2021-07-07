import React, { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, Text, View, Pressable} from 'react-native';
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
            <Pressable>
                {({ pressed }) => (
                    <Icon 
                        name='check' 
                        size={size}
                        color={pressed?'lightgreen':'green'}
                        onPress={role=="2" ? fctStatut : ()=>{}}
                        style={styles.statusIcon}
                    />
                )}
            </Pressable>
        </View>);
    }
    else if( (status == "Absent") && (role == "2") ) {
        return(<View style={{ justifyContent:"center", flexDirection: align, alignSelf: "center"}}>
            <Pressable>
                {({ pressed }) => (
                    <Icon 
                        name='note' 
                        size={size}
                        color={pressed?'darkslategrey':'black'}
                        onPress={fctCommentaire}
                        style={styles.statusIcon}
                    />
                )}
            </Pressable>
            
            <Pressable>
                {({ pressed }) => (
                    <Icon 
                        name='x' 
                        size={size}
                        color={pressed?'orangered':'red'}
                        onPress={fctStatut}
                        style={styles.statusIcon}
                    />
                )}
            </Pressable>
        
        </View>);
    }
    else if(status == "Absent") {
        return(<View  style={{justifyContent: "center"}}>
            <Pressable>
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
    else{
        return(<View style={{justifyContent: "center"}}>
            <Pressable>
                {({ pressed }) => (
                    <Icon 
                        name='unverified' 
                        size={size}
                        color={pressed?'darkslategrey':'black'}
                        onPress={role=="2" ? fctStatut : ()=>{}}
                        style={styles.statusIcon}
                    />
                )}
            </Pressable>
        </View>);
    }
    
}

export default ViewStatus;