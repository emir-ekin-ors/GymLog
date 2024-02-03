import { Text, View, SafeAreaView, StyleSheet, Pressable, Platform, Modal, KeyboardAvoidingView, Animated } from 'react-native';
import { CustomButton } from '../components/CustomButton';
import { useEffect, useState } from 'react';
import { getData, storeData } from '../helpers/Storage';
import { GestureHandlerRootView, Swipeable, TouchableOpacity } from 'react-native-gesture-handler';
import Ionicons from '@expo/vector-icons/Ionicons';

export default function Programs({ navigation }) {
    const [programsList, setProgramsList] = useState([]);
    const [lastProgramId, setLastProgramId] = useState(1);
    const [deleteProgramId, setDeleteProgramId] = useState(-1);
    const [isModalVisible, setIsModalVisible] = useState(false);
    let programRows = [];

    useEffect(() => {
        (async function () {
            try {
                const programs = await getData('programs');
                setProgramsList(programs);
                const lastId = programs.length > 0 ? programs[programs.length - 1].id : 0;
                setLastProgramId(lastId + 1);
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
            if (programsList.length > 0) {
                updatedProgramsList = [...programsList, program];
            } else {
                updatedProgramsList = [program];
            }
        }

        setProgramsList(updatedProgramsList);
        storeData('programs', updatedProgramsList);

        const lastId = updatedProgramsList.length > 0 ? updatedProgramsList[updatedProgramsList.length - 1].id : 0;
        setLastProgramId(lastId + 1);
    }

    function openDeleteModal(programId, programIndex) {
        programRows[programIndex].close();
        setDeleteProgramId(programId);
        setIsModalVisible(true);
    }

    function deleteProgram() {
        var newProgramList = [];
        programsList.forEach(item => {
            if (item.id != deleteProgramId) {
                newProgramList.push(item);
            }
        });
        setProgramsList(newProgramList);
        storeData('programs', newProgramList);

        setIsModalVisible(false);
    }

    const renderRightActions = (progress, dragAnimatedValue, programId) => {
        const opacity = dragAnimatedValue.interpolate({
            inputRange: [-150, 0],
            outputRange: [1, 0],
            extrapolate: 'clamp',
        });
        return (
            <View style={styles.swipedRow}>
                <Animated.View style={[styles.deleteButton, { opacity }]}>
                    <Ionicons name='trash' size={30} color='white' style={styles.deleteIcon} />
                </Animated.View>
            </View>
        );
    };

    return (
        <View style={styles.container}>
            <SafeAreaView>
                {
                    programsList.length > 0 ? programsList.map((program, index) => {
                        return (
                            <GestureHandlerRootView key={program.id} style={styles.gestureContainer}>
                                <Swipeable
                                    ref={ref => programRows[index] = ref}
                                    renderRightActions={renderRightActions}
                                    onSwipeableOpen={() => openDeleteModal(program.id, index)}
                                    friction={2}
                                >
                                    <View style={styles.programContainer}>
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
                                </Swipeable>
                            </GestureHandlerRootView>
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
        padding: 20,
        backgroundColor: 'white'
    },
    gestureContainer: {
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
    programContainer: {
        width: '100%',
        alignSelf: 'center',
        borderWidth: 1,
        borderRadius: 5,
        borderColor: 'lightblue',
        backgroundColor: 'lightblue',
        marginBottom: 20,
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
    },
    swipedRow: {
        flexDirection: 'row',
        flex: 1,
        alignItems: 'center',
        justifyContent: 'flex-end',
        paddingLeft: 5,
        backgroundColor: 'red',
        marginBottom: 20,
        borderRadius: 5,
    },
    deleteButton: {
        flexDirection: 'column',
        justifyContent: 'center',
        height: '100%',
        marginRight: 10
    },
});
