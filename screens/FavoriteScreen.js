import {
    View,
    Text,
    StyleSheet,
    Platform,
    StatusBar,
    TouchableOpacity,
    TextInput,
    KeyboardAvoidingView,
} from "react-native";
import { useState, useEffect } from "react";

import { colors } from "../assets/colors";
import {backendURL} from '../assets/URLs'

import { useDispatch, useSelector } from "react-redux";
import { addFavorite, emptyReducer, removeFavorite } from "../reducers/favoriteFlights";
import FlightCard from "../components/flightCard";

export default function MyFlightsScreen({navigation}) {

    const user = useSelector((state) => state.user.value);
    const favoriteFlights = useSelector((state) => state.favoriteFlights.value);

    const dispatch = useDispatch();

    useEffect(() => {
    if(user.token){

        fetch(`${backendURL}/user/favorites`,{
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: user.email, token: user.token }),
            })
            .then((response) => response.json())
            .then(data => {
                if (data.favorites){
                    dispatch(emptyReducer())
                    for (let favorite of data.favorites){
                        console.log(favorite)
                        dispatch(addFavorite(favorite.flightData))
                    }
                }
                console.log(favoriteFlights)
            })     
    }
    }, []);
    console.log(favoriteFlights)
    return (
        
        <View style={styles.container}>
            <Text style={styles.title}>Mes vols favoris</Text>
            {favoriteFlights.length>0 ?
            favoriteFlights.map( (item, i) => {
                return <FlightCard key={i} flightData={item} ></FlightCard>
            }) : <Text style={styles.noFavoriteText}>Vous n'avez pas de vols suvegardés</Text>}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex:1,
        paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
        //justifyContent:'center',
        alignItems:'center',
        backgroundColor:colors.lightGrey,
    },
    title:{
        textDecorationLine:'underline',
        fontSize:20,
        color:colors.dark1,
        marginBottom:20,
    },
    noFavoriteText:{
        color:colors.dark1,
        fontStyle:'italic',
        paddingTop:30,
    }
});