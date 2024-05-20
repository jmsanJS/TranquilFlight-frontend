import { View, Text, StyleSheet, Platform, StatusBar } from 'react-native';

import {colors} from '../assets/colors'

export default function SignupScreen() {
    return (
        <View style={styles.container}>
            <Text>SignupScreen</Text>
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