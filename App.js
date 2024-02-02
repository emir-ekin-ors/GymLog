import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Ionicons from '@expo/vector-icons/Ionicons';
import Programs from './app/screens/Programs';
import Program from './app/screens/Program';
import { StyleSheet } from 'react-native';
import Timer from './app/screens/Timer';
import Songs from './app/screens/Songs';
import { useEffect } from 'react';
import { storeData } from './app/helpers/Storage';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function ProgramsStack() {
  return (
    <Stack.Navigator screenOptions={{headerTintColor: 'black'}}>
      <Stack.Screen name="Programs" component={Programs} />
      <Stack.Screen name="Program" component={Program} />
    </Stack.Navigator>
  );
}

export default function App() {
  useEffect(() => {
    // storeData('programs', {});
  },[]);
  return (
    <NavigationContainer>
      <Tab.Navigator initialRouteName='ProgramsList' screenOptions={{tabBarShowLabel: false, tabBarActiveTintColor: '#00C1FF'}}>
        <Tab.Screen name="Timer" component={Timer} options={{ tabBarIcon: ({color}) => (<Ionicons name='stopwatch' size={30} color={color} />) }} />
        <Tab.Screen name="ProgramsList" component={ProgramsStack} options={{ tabBarIcon: ({color}) => (<Ionicons name='barbell' size={30} color={color} />), headerShown: false }} />
        <Tab.Screen name="Songs" component={Songs}  options={{ tabBarIcon: ({color}) => (<Ionicons name='musical-notes' size={30} color={color} />) }} />
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
