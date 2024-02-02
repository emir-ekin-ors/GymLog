import { useEffect, useState } from "react";
import { View, Text, StyleSheet, TextInput, Pressable, Platform, Modal, Button, KeyboardAvoidingView } from "react-native";
import { Table, TableWrapper, Row, Cell } from 'react-native-table-component';
import { CustomButton } from "./CustomButton";

export default function Workout({ updateWorkout, workoutId, name = '', sets = [] }) {
    const [workoutName, setWorkoutName] = useState(name);
    const [workoutSetsList, setWorkoutSetsList] = useState(sets);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [newSet, setNewSet] = useState({});

    function changeWorkoutName(name) {
        setWorkoutName(name);
        updateWorkout({id: workoutId, name: name, sets: workoutSetsList });
    }

    function addSet() {
        const lastId = workoutSetsList.length > 0 ? workoutSetsList[workoutSetsList.length - 1].id + 1 : 1;
        setNewSet({ id: lastId, weight: '', reps: '' });
        setIsModalVisible(true);
        setWorkoutSetsList([...workoutSetsList, { id: workoutSetsList.length + 1, weight: '-', reps: '-' }])
    }

    function saveSet() {
        const itemIndex = workoutSetsList.findIndex(item => item.id === newSet.id);
        var updatedSets = [];

        if (itemIndex != -1) {
            updatedSets = [...workoutSetsList];
            updatedSets[itemIndex] = { ...updatedSets[itemIndex], weight: newSet.weight, reps: newSet.reps };
        } else {
            updatedSets = [...workoutSetsList, newSet];
        }

        setWorkoutSetsList(updatedSets);
        updateWorkout({id: workoutId, name: workoutName, sets: updatedSets });
        setIsModalVisible(false);
    }

    function onSetClick(setId) {
        const itemIndex = workoutSetsList.findIndex(item => item.id === setId);
        setNewSet({ id: setId, weight: workoutSetsList[itemIndex].weight, reps: workoutSetsList[itemIndex].reps });
        setIsModalVisible(true);
    }

    function deleteSet(setId) {
        var newList = [];
        workoutSetsList.forEach((item, index) => {
            if (item.id < setId) {
                newList.push(item);
            } else if (item.id > setId) {
                newList.push({ id: item.id - 1, weight: item.weight, reps: item.reps });
            }
        });
        setWorkoutSetsList(newList);
        updateWorkout({ id: workoutId, name: workoutName, sets: newList });
        setIsModalVisible(false);
    }

    return (
        <View style={styles.container}>
            <TextInput
                value={workoutName}
                onChangeText={(name) => { changeWorkoutName(name) }}
                placeholder='Bench Press, Pull Down, ...'
                placeholderTextColor='lightblue'
                autoCorrect={false}
                style={styles.inputText}
            />

            <Table borderStyle={{ borderColor: 'transparent', width: '100%' }} style={{ marginBottom: 20 }}>
                <Row data={['Set', 'Weight', 'Reps']} style={styles.headTable} textStyle={styles.textTableHead} />
                {workoutSetsList.length > 0 ? workoutSetsList.map((set, index) => {
                    return (
                        <Pressable key={set.id} onPress={() => onSetClick(set.id)}>
                            <TableWrapper style={styles.rowTable}>
                                <Cell key={1} data={set.id} textStyle={styles.textTableCell} />
                                <Cell key={2} data={set.weight} textStyle={styles.textTableCell} />
                                <Cell key={3} data={set.reps} textStyle={styles.textTableCell} />
                            </TableWrapper>
                        </Pressable>
                    );
                }) : <Text></Text>}
            </Table>

            <CustomButton
                text='Add Set'
                buttonColor='#404040'
                textColor='white'
                onButtonPress={addSet}
            />

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
                            <Text style={styles.modalTitle}>Set {newSet.id}</Text>
                            <View style={{ flexDirection: 'row', justifyContent: 'space-around', alignItems: 'baseline' }}>
                                <Text style={{ fontSize: 20, fontWeight: 'bold', marginLeft: 15 }}>Weight</Text>
                                <TextInput
                                    value={newSet.weight?.toString()}
                                    onChangeText={(newWeight) => setNewSet({ ...newSet, weight: newWeight })}
                                    autoCorrect={false}
                                    autoFocus={true}
                                    keyboardType="numeric"
                                    style={styles.repText}
                                />

                                <Text style={{ fontSize: 20, fontWeight: 'bold' }}>Reps</Text>
                                <TextInput
                                    value={newSet.reps?.toString()}
                                    onChangeText={(newReps) => setNewSet({ ...newSet, reps: newReps })}
                                    autoCorrect={false}
                                    keyboardType="numeric"
                                    style={styles.repText}
                                />
                            </View>

                            <CustomButton
                                text='Save'
                                buttonColor='#404040'
                                textColor='white'
                                onButtonPress={saveSet}
                            />
                            {
                                newSet.id < workoutSetsList.length + 1 ?
                                    <CustomButton
                                        text='Delete'
                                        buttonColor='#bb0000'
                                        textColor='white'
                                        onButtonPress={() => deleteSet(newSet.id)}
                                    />
                                    : <View style={{ height: 0, width: 0 }}></View>
                            }
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
        </View >
    );
}

const styles = StyleSheet.create({
    container: {
        borderWidth: 1,
        width: '80%',
        borderRadius: 5,
        borderColor: 'lightblue',
        backgroundColor: 'lightblue',
        padding: 20,
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
    setContainer: {
        flexDirection: 'row',
        alignItems: 'baseline',
    },
    text: {
        fontSize: 20,
    },
    inputText: {
        fontSize: 16,
        fontWeight: 'bold',
        paddingBottom: 5,
        marginBottom: 20,
        borderBottomColor: 'black',
        backgroundColor: '#efffff',
        borderRadius: 5,
        padding: 10,
    },
    repText: {
        fontSize: 40,
        backgroundColor: '#efffff',
        borderRadius: 10,
        width: '20%',
        height: 50,
        marginBottom: 30,
        marginRight: 5,
        textAlign: 'center',
        marginRight: 30,
    },
    tableContainer: {
        flex: 1,
        padding: 16,
        paddingTop: 30,
        alignItems: 'center',
    },
    headTable: {
        height: 40,
        backgroundColor: '#404040',
    },
    textTableHead: {
        margin: 6,
        textAlign: 'center',
        color: 'white'
    },
    textTableCell: {
        margin: 6,
        textAlign: 'center',
    },
    rowTable: {
        flexDirection: 'row',
        backgroundColor: '#efffff',
        marginTop: 15,
    },
    modalTitle: {
        fontSize: 30,
        fontWeight: 'bold',
        marginBottom: 20,
    }
});