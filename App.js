import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Ionicons from '@expo/vector-icons/Ionicons';
import Programs from './screens/Programs';
import { Pressable, StyleSheet, Text } from 'react-native';
import NewProgram from './screens/NewProgram';
import { useNavigation } from '@react-navigation/native';
import Timer from './screens/Timer';
import Songs from './screens/Songs';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function newProgramButton() {
  const navigation = useNavigation();
  return (
    <Pressable onPress={() => { navigation.navigate("NewProgram") }}>
      <Ionicons name="add" style={styles.tabBar} />
    </Pressable>
  );
}

function ProgramsStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Programs" component={Programs}  options={{ headerRight: newProgramButton }} />
      <Stack.Screen name="NewProgram" component={NewProgram} options={{headerTitle: 'New Program', headerTintColor: 'black'}} />
    </Stack.Navigator>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <Tab.Navigator initialRouteName='Programs'>
        <Tab.Screen name="Timer" component={Timer} />
        <Tab.Screen name="Programs" component={ProgramsStack} options={{headerShown: false}} />
        <Tab.Screen name="Songs" component={Songs} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    fontSize: 30,
    marginRight: 10
  }
});
