import { StyleSheet, Text, View, SafeAreaView, TextInput } from 'react-native';
import NewWorkout from '../components/NewWorkout';
import { useState } from 'react';

export default function NewProgram() {
  const [programTitle, setProgramTitle] = useState("");
  return (
    <SafeAreaView style={styles.container}>
      <TextInput
        value={programTitle}
        onChangeText={setProgramTitle}
        placeholder='Chest, Upper Body, Thursday, ...'
        placeholderTextColor='white'
        autoCorrect={false}
        style={styles.inputText}
      />
      <NewWorkout />
    </SafeAreaView>
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
    marginBottom: 40,
    fontWeight: 'bold',
    backgroundColor: 'lightblue'
  },
});