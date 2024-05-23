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
import { useState } from "react";

import { colors } from "../assets/colors";

import { useDispatch, useSelector } from "react-redux";
import { addFavorite, removeFavorite } from "../reducers/favoriteFlights";
import FlightCard from "../components/flightCard";

export default function MyFlightsScreen({navigation}) {

    const user = useSelector((state) => state.user.value);
    const favoriteFlights = useSelector((state) => state.favoriteFlights.value);

    //console.log('fac',favoriteFlights[1][0][0].number)

    return (
        
        <View style={styles.container}>
            <Text style={styles.title}>Mes vols favoris</Text>
            {favoriteFlights.length>0 ?
            favoriteFlights.map( (item, i) => {
                return <FlightCard key={i} flightData={item}></FlightCard>
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