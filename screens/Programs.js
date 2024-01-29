import { Text, View, SafeAreaView, StyleSheet, Pressable, Platform } from 'react-native';
import { CustomButton } from '../components/CustomButton';
import { useEffect, useState } from 'react';
import { getData, storeData } from '../helpers/Storage';

export default function Programs({ navigation }) {
    const [programsList, setProgramsList] = useState([]);
    const [lastProgramId, setLastProgramId] = useState(1);

    useEffect(() => {
        (async function () {
            try {
                const programs = await getData('programs');
                setProgramsList(programs);
            } catch (e) {
                console.error(e);
            }
        })();
        // storeData('programs', {});
    }, []);

    async function updateProgramsList(program) {
        const programIndex = programsList.findIndex(item => item.id === program.id);
        var updatedProgramsList = [];

        if (programIndex != -1) {
            updatedProgramsList = [...programsList];
            updatedProgramsList[programIndex] = program;
        } else {
            updatedProgramsList = [...programsList, program];
        }

        setProgramsList(updatedProgramsList);

        console.log('Storing these programs: ', updatedProgramsList);
        storeData('programs', updatedProgramsList);
        const data = await getData('programs');
        console.log('Programs: ', data);

        const lastId = updatedProgramsList.length > 0 ? updatedProgramsList[updatedProgramsList.length - 1].id : 0;
        setLastProgramId(lastId + 1);
    }

    return (
        <View style={styles.container}>
            <SafeAreaView>
                {
                    programsList.length > 0 ? programsList.map((program, index) => {
                        return (
                            <View key={program.id} style={styles.programContainer}>
                                <Pressable onPress={
                                    () => navigation.navigate('Program', {
                                        programId: program.id,
                                        updateProgramsList: updateProgramsList
                                    })
                                }>
                                    <Text style={styles.programTitle}>
                                        {program.name}
                                    </Text>
                                </Pressable>
                            </View>
                        );
                    }) : <Text></Text>
                }

                <CustomButton
                    text='New Program'
                    buttonColor='#404040'
                    textColor='white'
                    onButtonPress={
                        () => navigation.navigate("NewProgram", {
                            programId: lastProgramId,
                            updateProgramsList: updateProgramsList
                        })
                    }
                />
            </SafeAreaView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20
    },
    programContainer: {
        alignSelf: 'center',
        borderWidth: 1,
        width: '100%',
        borderRadius: 5,
        borderColor: 'lightblue',
        backgroundColor: 'lightblue',
        padding: 20,
        marginBottom: 20,
        ...Platform.select({
            ios: {
                shadowColor: "#333333",
                shadowOffset: {
                    width: 6,
                    height: 6
                },
                shadowOpacity: 0.6,
                shadowRadius: 4
            },
            android: {
                shadowColor: "#333333",
                elevation: 10
            }
        })
    },
    programTitle: {
        fontSize: 30,
        fontWeight: 'bold',
    }
});
