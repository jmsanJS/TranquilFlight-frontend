import { View, Text, StyleSheet } from 'react-native';

export default function MyFlightsScreen() {
    return (
        <View style={styles.container}>
            <Text>MyFlightsScreen</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        width: '100%',
        height: '100%',
    },
});