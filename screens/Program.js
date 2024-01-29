import { StyleSheet, Text, View, SafeAreaView, TextInput, ScrollView } from 'react-native';
import NewWorkout from '../components/NewWorkout';
import { useEffect, useState } from 'react';
import { CustomButton } from '../components/CustomButton';
import { getData } from '../helpers/Storage';

export default function Program({ route, navigation }) {

    const { programId, updateProgramsList } = route.params;

    const [programTitle, setProgramTitle] = useState("");
    const [workoutList, setWorkoutList] = useState([{ id: 1, workout: {} }]);

    useEffect(() => {
        (async function () {
            try {
                const programs = await getData('programs');
                const itemIndex = programs.findIndex(item => item.id === programId);
                setProgramTitle(programs[itemIndex].name);
                var workoutsArray = [];
                programs[itemIndex].workouts.forEach(workout => {
                    workoutsArray.push(workout.workout)
                });
                setWorkoutList(workoutsArray);
            } catch (e) {
                console.error(e);
            }
        })();
    }, []);

    function addWorkout() {
        const lastId = workoutList.length > 0 ? workoutList[workoutList.length - 1].id + 1 : 1;
        setWorkoutList([...workoutList, { id: lastId, workout: {} }]);
    }

    function updateWorkoutList(workoutId, setsList) {
        const itemIndex = workoutList.findIndex(item => item.id === workoutId);

        if (itemIndex != -1) {
            const updatedWorkoutSetsList = [...workoutList];
            updatedWorkoutSetsList[itemIndex] = { ...updatedWorkoutSetsList[itemIndex], workout: setsList };
            setWorkoutList(updatedWorkoutSetsList);
        } else {
            setWorkoutList([...workoutList, setsList]);
        }
    }

    function saveProgram() {
        // console.log(program);
        // console.log('------------');
        // workoutList.forEach((item) => {
        //   console.log('Workout id: ', item.id);
        //   console.log('Workout name: ', item.workout.name);
        //   console.log('Workout sets: ', item.workout.sets);
        // })
        const program = { id: programId, name: programTitle, workouts: workoutList };
        updateProgramsList(program);
        navigation.navigate('Programs');
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

                {workoutList.length > 0 ? workoutList.map((workout, index) => {
                    console.log('Workout', workout);
                    return (
                        <NewWorkout key={workout.id} name={workout.name} sets={workout.sets} workoutId={workout.id} updateWorkoutList={updateWorkoutList} />
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
});