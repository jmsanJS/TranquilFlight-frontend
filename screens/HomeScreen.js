import { View, Text, StyleSheet, SafeAreaView, Platform, StatusBar } from 'react-native';

import {colors} from '../assets/colors'

export default function HomeScreen() {
    return (
        <SafeAreaView style={styles.container}>
            <Text>HomeScreen</Text>
        </SafeAreaView>
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
