import { View, Text, StyleSheet } from 'react-native';

export default function SigninScreen() {
    return (
        <View style={styles.container}>
            <Text>SigninScreen</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        width: '100%',
        height: '100%',
    },
});