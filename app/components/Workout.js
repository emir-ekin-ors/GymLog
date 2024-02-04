import { useEffect, useState } from "react";
import { View, Text, StyleSheet, TextInput, Pressable, Platform, Modal, Button, KeyboardAvoidingView } from "react-native";
import { Table, TableWrapper, Row, Cell } from 'react-native-table-component';
import { CustomButton } from "./CustomButton";
import Ionicons from "@expo/vector-icons/Ionicons";
import {colors} from '../helpers/constants';

export default function Workout({ updateWorkout, openDeleteModal, workout, name = '', sets = [] }) {
    const [workoutName, setWorkoutName] = useState(name);
    const [workoutSetsList, setWorkoutSetsList] = useState(sets);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [newSet, setNewSet] = useState({});

    function changeWorkoutName(name) {
        setWorkoutName(name);
    }

    function addSet() {
        const lastId = workoutSetsList.length > 0 ? workoutSetsList[workoutSetsList.length - 1].id + 1 : 1;
        setNewSet({ id: lastId, weight: '', reps: '' });
        setIsModalVisible(true);
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
        updateWorkout({ id: workout.id, name: workoutName, sets: updatedSets, bestSets: workout.bestSets });
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
        updateWorkout({ id: workout.id, name: workoutName, sets: newList, bestSets: workout.bestSets });
        setIsModalVisible(false);
    }

    return (
        <View style={styles.container}>
            <View style={{flexDirection: 'row'}}>
                <TextInput
                    value={workoutName}
                    onChangeText={(name) => { changeWorkoutName(name) }}
                    placeholder='Bench Press, Pull Down, ...'
                    placeholderTextColor={colors.primaryBlue}
                    autoCorrect={false}
                    style={styles.inputText}
                />
                <Pressable onPress={() => openDeleteModal(workout.id)}>
                    <Ionicons name='trash' size={30} color={colors.red} style={{marginLeft: 10}} />
                </Pressable>
            </View>
            {
                workout.bestSets != null && workout.bestSets.length > 0 &&
                <View style={styles.bestSetsContainer}>
                    <Text style={styles.personalBestSection}>Best</Text>
                    <View style={{ flexDirection: 'row' }}>
                        {
                            workout.bestSets.map((set, index) => {
                                var endSymbol = <Ionicons name="caret-forward-outline" color='white' style={{ marginTop: 3 }} />;
                                if (index == workout.bestSets.length - 1) endSymbol = <Text></Text>;
                                const text = set.weight.toString() + 'x' + set.reps.toString();
                                return (
                                    <View key={index} style={{ flexDirection: 'row' }}>
                                        <Text style={styles.personalBestSection}>{text}</Text>{endSymbol}
                                    </View>
                                );
                            })
                        }
                    </View>
                </View>
            }

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
                buttonColor={colors.primaryBlack}
                textColor={colors.white}
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
                                backgroundColor: colors.primaryBlue,
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
                                buttonColor={colors.primaryBlack}
                                textColor={colors.white}
                                onButtonPress={saveSet}
                            />
                            {
                                workoutSetsList.some(set => set.id === newSet.id) ?
                                    <CustomButton
                                        text='Delete'
                                        buttonColor={colors.red}
                                        textColor={colors.white}
                                        onButtonPress={() => deleteSet(newSet.id)}
                                    />
                                    : <View style={{ height: 0, width: 0 }}></View>
                            }
                            <CustomButton
                                text='Cancel'
                                buttonColor={colors.white}
                                textColor={colors.primaryBlack}
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
        borderColor: colors.primaryBlue,
        backgroundColor: colors.primaryBlue,
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
        borderBottomColor: colors.secondaryBlack,
        backgroundColor: colors.secondaryBlue,
        borderRadius: 5,
        padding: 10,
        width: '90%'
    },
    repText: {
        fontSize: 40,
        backgroundColor: colors.secondaryBlue,
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
        backgroundColor: colors.primaryBlack,
    },
    textTableHead: {
        margin: 6,
        textAlign: 'center',
        color: colors.white
    },
    textTableCell: {
        margin: 6,
        textAlign: 'center',
    },
    rowTable: {
        flexDirection: 'row',
        backgroundColor: colors.secondaryBlue,
        marginTop: 15,
    },
    modalTitle: {
        fontSize: 30,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    personalBestSection: {
        fontSize: 14,
        fontWeight: 'bold',
        color: colors.white,
    },
    bestSetsContainer: {
        backgroundColor: colors.red,
        padding: 5,
        alignItems: 'center',
        marginBottom: 5,
        borderRadius: 5
    }
});