import { Text, View, SafeAreaView, StyleSheet } from 'react-native';

export default function Programs() {
    return (
        <View style={styles.container}>
            <SafeAreaView>
                <Text style={styles.centerText}>You don't have any programs yet.</Text>
            </SafeAreaView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
    },
    centerText: {
        fontSize: 24,
        alignSelf: 'center',
    }
});
