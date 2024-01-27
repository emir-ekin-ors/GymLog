import { Text, View, SafeAreaView, StyleSheet } from 'react-native';

export default function Songs() {
    return (
        <View style={styles.container}>
            <SafeAreaView>
                <Text style={styles.centerText}>Songs</Text>
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
