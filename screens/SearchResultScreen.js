import { View, Text, StyleSheet, Platform, StatusBar } from 'react-native';

import {colors} from '../assets/colors'

export default function SearchResultScreen({navigation}) {
    return (
        <View style={styles.container}>
            <Text>SearchResultScreen</Text>
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