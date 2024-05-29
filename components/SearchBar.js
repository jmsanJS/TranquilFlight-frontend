import {
    View,
    Text,
    StyleSheet,
    SafeAreaView,
    Platform,
    StatusBar,
    TextInput,
    TouchableOpacity,
    ImageBackground,
    KeyboardAvoidingView,
} from "react-native";

import { useNavigation } from '@react-navigation/native';

import { colors } from "../assets/colors";
import {backendURL} from '../assets/URLs'

import FontAwesome from "react-native-vector-icons/FontAwesome";

import DateTimePickerModal from "react-native-modal-datetime-picker";

import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addFlight, removeFlight } from "../reducers/flightsResult";

function SearchBar(props) {

    const navigation = useNavigation();

    const [isFocused, setIsFocused] = useState({
        flightNumber: false,
        flightDate: false,
    });
    const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
    const [dateOfFlight, setDateOfFlight] = useState(null);
    const [numberOfFlight, setNumberOfFlight] = useState(null);
    const [errorMessage, setErrorMessage] = useState("");

    const dispatch = useDispatch();
    const user = useSelector((state) => state.user.value);
    const flightsResult = useSelector((state) => state.flightsResult.value);

    const handleFocus = (key) => {
        setIsFocused((prevState) => ({ ...prevState, [key]: true }));
    };

    const handleBlur = (key) => {
        setIsFocused((prevState) => ({ ...prevState, [key]: false }));
    };

    const showDatePicker = () => {
        setDatePickerVisibility(true);
    };

    const hideDatePicker = () => {
        setDatePickerVisibility(false);
    };

    const handleConfirm = (date) => {
        setDateOfFlight(date.toISOString().slice(0, 10));
        hideDatePicker();
    };

    const handleSearchClick = () => {
        setErrorMessage("");
        fetch(`${backendURL}/flights/${numberOfFlight}/${dateOfFlight}`)
        .then((response) => response.json())
        .then((data) => {
            if (data.result) {
            dispatch(removeFlight());
            dispatch(addFlight(data.flightData));
            navigation.navigate("Résultats de recherche");
            } else if (data.result === false) {
            setErrorMessage(data.error);
            }
        });
    };

    return (
        
        <View style={styles.searchContainer}>
            <View style={[styles.fieldSet, isFocused.flightNumber && styles.focusedInput]}>
                <Text style={styles.legend}>N° de vol</Text>
                <TextInput
                cursorColor={colors.light1}
                allowFontScaling={true}
                keyboardType="text"
                autoCapitalize="none"
                placeholder="Saisissez votre N° de vol"
                style={styles.inputs}
                onChangeText={(value) => setNumberOfFlight(value)}
                onFocus={() => handleFocus("flightNumber")}
                onBlur={() => handleBlur("flightNumber")}
                value={numberOfFlight}
                ></TextInput>
            </View>
            
            <View style={[styles.fieldSet,isFocused.flightDate && styles.focusedInput]}>
                <Text style={styles.legend}>Date du vol</Text>
                <View style={styles.calendarInputContainer}>
                <TextInput
                    cursorColor={colors.light1}
                    allowFontScaling={true}
                    keyboardType="date"
                    autoCapitalize="none"
                    placeholder="AAAA-MM-DD"
                    style={styles.inputs}
                    onChangeText={(value) => setDateOfFlight(value)}
                    onFocus={() => handleFocus("flightDate")}
                    onBlur={() => handleBlur("flightDate")}
                    value={dateOfFlight}
                ></TextInput>
                <TouchableOpacity onPress={showDatePicker}>
                    <FontAwesome name="calendar" size={25} color={colors.dark1} />
                </TouchableOpacity>
                </View>
            </View>
            
            <View>
            <DateTimePickerModal
                // style={styles.calendarLayout}
                isVisible={isDatePickerVisible}
                mode="date"
                onConfirm={handleConfirm}
                onCancel={hideDatePicker}
            />
            </View>
            <View style={styles.errorMessageContainer}>
                <Text style={styles.errorMessage}>{errorMessage}</Text>
            </View>
            <TouchableOpacity
            onPress={() => handleSearchClick()}
            style={styles.searchBtn}
            >
                <Text style={styles.searchBtnText}>Rechercher</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({

    searchContainer:{
        width:'100%',
        height:260,
        flexDirection:'column',
        justifyContent:'center',
        alignItems:'center',
        paddingVertical:30,
        backgroundColor:colors.lightGrey
    },
    fieldSet: {
        width: "80%",
        paddingHorizontal: 5,
        paddingTop: 5,
        paddingBottom: 5,
        marginBottom:20,
        borderRadius: 5,
        borderWidth: 2,
        alignItems: "center",
        borderColor: "#000",
        borderColor: colors.dark1,
        backgroundColor: colors.lightGrey,
    },
    legend: {
        position: "absolute",
        top: -10,
        left: 10,
        fontWeight: "600",
        paddingHorizontal: 3,
        fontSize: 11,
        backgroundColor: colors.lightGrey,
        color: colors.dark1,
    },
    inputs: {
        width: "100%",
        justifyContent: "center",
        height: 40,
        color: colors.light1,
    },
    focusedInput: {
        borderWidth: 3,
        borderRadius: 3,
    },
    calendarInputContainer: {
        flexDirection: "row",
        justifyContent: "space-evenly",
        alignItems: "center",
        paddingHorizontal: 10,
        marginLeft: 2,
    },
    errorMessageContainer: {
        width: "80%",
        marginBottom: 2,
        marginTop: 0,
        marginBottom:15,
        marginTop:-15,
    },
    errorMessage: {
        color: "red",
        alignSelf: "flex-end",
        fontSize: 11,
    },
    searchBtn: {
        width: "80%",
        backgroundColor: colors.hot1,
        borderRadius: 5,
        justifyContent: "center",
        alignItems: "center",
        height: 50,
        marginTop:-15
        
    },
    searchBtnText: {
        alignSelf: "center",
        color: "white",
        fontWeight: "600",
        fontSize: 15,
    },
});

export default SearchBar;
