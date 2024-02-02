import { Text, View, SafeAreaView, StyleSheet, Pressable, Platform, Modal, KeyboardAvoidingView } from 'react-native';
import { CustomButton } from '../components/CustomButton';
import { useEffect, useState } from 'react';
import { getData, storeData } from '../helpers/Storage';
import Ionicons from '@expo/vector-icons/Ionicons';

export default function Programs({ navigation }) {
    const [programsList, setProgramsList] = useState([]);
    const [lastProgramId, setLastProgramId] = useState(1);
    const [deleteProgramId, setDeleteProgramId] = useState(-1);
    const [isModalVisible, setIsModalVisible] = useState(false);

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
        const programIndex = programsList.length > 0 ? programsList.findIndex(item => item.id === program.id) : -1;
        var updatedProgramsList = [];
        if (programIndex != -1) {
            updatedProgramsList = [...programsList];
            updatedProgramsList[programIndex] = program;
        } else {
            if(programsList.length > 0){
                updatedProgramsList = [...programsList, program];
            }else{
                updatedProgramsList = [program];
            }
        }

        setProgramsList(updatedProgramsList);
        /* console.log("--------");
        console.log('Storing these programs: ');
        updatedProgramsList.forEach((program) => {
            console.log('Program id: ', program.id);
            console.log('Program name: ', program.name);
            console.log('Program workouts: ');
            program.workouts.forEach((workout) => {
                console.log(workout);
            });
        }); */
        storeData('programs', updatedProgramsList);

        /*const data = await getData('programs');
         console.log("--------");
        console.log('Reading these programs: ');
        data.forEach((program) => {
            console.log('Program id: ', program.id);
            console.log('Program name: ', program.name);
            console.log('Program workouts: ');
            program.workouts.forEach((workout) => {
                console.log(workout);
            });
        });
        console.log('END'); */

        const lastId = updatedProgramsList.length > 0 ? updatedProgramsList[updatedProgramsList.length - 1].id : 0;
        setLastProgramId(lastId + 1);
    }

    function openDeleteModal(programId) {
        setDeleteProgramId(programId);
        setIsModalVisible(true);
    }

    function deleteProgram() {
        var newProgramList = [];
        programsList.forEach((item, index) => {
            if (item.id != deleteProgramId) {
                newProgramList.push(item);
            }
        });
        setProgramsList(newProgramList);
        storeData('programs', newProgramList);

        setIsModalVisible(false);
    }

    return (
        <View style={styles.container}>
            <SafeAreaView>
                {
                    programsList.length > 0 ? programsList.map((program, index) => {
                        return (
                            <View key={program.id} style={styles.programContainer}>
                                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
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
                                    <Pressable onPress={() => openDeleteModal(program.id)}>
                                        <Ionicons name='trash' size={30} color='#ee0000' style={styles.deleteIcon} />
                                    </Pressable>
                                </View>
                            </View>
                        );
                    }) : <Text></Text>
                }

                <CustomButton
                    text='New Program'
                    buttonColor='#404040'
                    textColor='white'
                    onButtonPress={
                        () => navigation.navigate("Program", {
                            programId: lastProgramId,
                            updateProgramsList: updateProgramsList
                        })
                    }
                />
            </SafeAreaView>
            <Modal
                visible={isModalVisible}
                onRequestClose={() => setIsModalVisible(false)}
                animationType='slide'
                transparent={true}
            >
                <KeyboardAvoidingView
                    behavior="padding"
                    keyboardVerticalOffset={100}
                    style={{ flex: 1 }}
                >
                    <View
                        style={{
                            flex: 1,
                            flexDirection: 'column-reverse',
                            justifyContent: 'flex-end',
                        }}
                    >

                        <View
                            style={{
                                height: '100%',
                                backgroundColor: 'lightblue',
                                borderRadius: 20,
                                padding: 20
                            }}>
                            <Text style={styles.modalTitle}>Are you sure?</Text>
                            <CustomButton
                                text='Delete'
                                buttonColor='#bb0000'
                                textColor='white'
                                onButtonPress={deleteProgram}
                            />
                            <CustomButton
                                text='Cancel'
                                buttonColor='white'
                                textColor='#404040'
                                onButtonPress={() => setIsModalVisible(false)}
                            />
                        </View>
                        <Pressable onPress={() => setIsModalVisible(false)}>
                            <View style={{ backgroundColor: 'transparent', height: '70%' }} />
                        </Pressable>
                    </View>
                </KeyboardAvoidingView>
            </Modal >
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
        margin: 20,
    },
    deleteIcon: {
        marginTop: 5,
        marginRight: 5,
    },
    modalTitle: {
        fontSize: 30,
        fontWeight: 'bold',
        marginBottom: 20,
    }
});
