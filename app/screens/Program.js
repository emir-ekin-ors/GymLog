import { StyleSheet, Text, View, SafeAreaView, TextInput, ScrollView, Modal, KeyboardAvoidingView, Pressable } from 'react-native';
import Workout from '../components/Workout';
import { useEffect, useState } from 'react';
import { CustomButton } from '../components/CustomButton';
import { getData } from '../helpers/Storage';
import Ionicons from '@expo/vector-icons/Ionicons';

var listId = 0;

export default function Program({ route, navigation }) {

    const { programId, updateProgramsList } = route.params;

    const [programTitle, setProgramTitle] = useState("");
    const [workoutList, setWorkoutList] = useState([]);
    const [deleteWorkoutId, setDeleteWorkoutId] = useState(-1);
    const [isModalVisible, setIsModalVisible] = useState(false);

    function updateWorkout(workout) {
        const itemIndex = workoutList.findIndex(item => item.id === workout.id);

        if (itemIndex != -1) {
            const updatedWorkoutSetsList = [...workoutList];
            updatedWorkoutSetsList[itemIndex] = workout;
            setWorkoutList(updatedWorkoutSetsList);
        } else {
            setWorkoutList([...workoutList, workout]);
        }
    }

    useEffect(() => {
        (async function () {
            try {
                const programs = await getData('programs');
                if (Object.keys(programs).length !== 0) {
                    const itemIndex = programs.findIndex(item => item.id === programId);
                    if (itemIndex != -1) {
                        setProgramTitle(programs[itemIndex].name);
                        var workoutsArray = [];
                        programs[itemIndex].workouts.forEach(workout => {
                            workoutsArray.push(workout);
                        });
                        setWorkoutList(workoutsArray);
                    }
                }
            } catch (e) {
                console.error(e);
            }
        })();
    }, []);

    function addWorkout() {
        const lastId = workoutList.length > 0 ? workoutList[workoutList.length - 1].id + 1 : 1;
        setWorkoutList([...workoutList, { id: lastId }]);
    }

    function saveProgram() {
        const program = { id: programId, name: programTitle, workouts: workoutList };
        updateProgramsList(program);
        navigation.goBack();
    }

    function openDeleteModal(workoutId) {
        setDeleteWorkoutId(workoutId);
        setIsModalVisible(true);
    }

    function deleteWorkout() {
        var newWorkoutList = [];
        workoutList.forEach((set, index) => {
            if (set.id != deleteWorkoutId) {
                newWorkoutList.push(set);
            }
        });
        setWorkoutList(newWorkoutList);
        setIsModalVisible(false);
    }

    return (
        <ScrollView>
            <SafeAreaView style={styles.container}>
                <TextInput
                    value={programTitle}
                    onChangeText={setProgramTitle}
                    placeholder='Chest, Upper Body, Thursday, ...'
                    placeholderTextColor='white'
                    autoCorrect={false}
                    style={styles.inputText}
                />

                {workoutList.length > 0 ? workoutList.map((workout) => {
                    return (
                        <View key={listId++} style={{ width: '100%', alignItems: 'center' }}>
                            <View style={{width: '85%', alignItems: 'flex-end', marginBottom: -20, zIndex: 1}}>
                                <Pressable onPress={() => openDeleteModal(workout.id)}>
                                    <Ionicons name='trash' size={30} color='#ee0000' style={styles.deleteIcon} />
                                </Pressable>
                            </View>
                            <Workout name={workout.name} sets={workout.sets} workoutId={workout.id} updateWorkout={updateWorkout} />
                        </View>
                    );
                }) : <Text></Text>}

                <View style={{ width: '100%', padding: 40 }}>
                    <CustomButton
                        text='Add Workout'
                        buttonColor='#404040'
                        textColor='white'
                        onButtonPress={addWorkout}
                    />
                    <CustomButton
                        text='Save'
                        buttonColor='lightblue'
                        textColor='white'
                        onButtonPress={saveProgram}
                    />
                </View>
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
                                onButtonPress={deleteWorkout}
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
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        paddingTop: 20,
        marginTop: 20,
    },
    titleText: {
        fontSize: 20,
    },
    inputText: {
        height: 40,
        width: '80%',
        margin: 12,
        padding: 10,
        borderRadius: 5,
        fontWeight: 'bold',
        backgroundColor: 'lightblue',
        textAlign: 'center',
        fontSize: 20
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