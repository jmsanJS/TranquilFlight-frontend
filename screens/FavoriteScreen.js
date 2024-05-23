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

export default function MyFlightsScreen({navigation}) {

    const user = useSelector((state) => state.user.value);
    const favoriteFlights = useSelector((state) => state.favoriteFlights.value);

    console.log('fac',favoriteFlights)

    return (
        <View style={styles.container}>
            <Text>{favoriteFlights[1][0][0].number}</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex:1,
        paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
        justifyContent:'center',
        alignItems:'center',
        backgroundColor:colors.lightGrey,
    },
});