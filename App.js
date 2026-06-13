import { NavigationContainer } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { Text } from 'react-native'

import Login from './screens/Login'
import Home from './screens/Home'
import Compromissos from './screens/Compromissos'
import Notas from './screens/Notas'
import Habitos from './screens/Habitos'

const Stack = createNativeStackNavigator()
const Tab = createBottomTabNavigator()

// Tabs que aparecem depois do login
function AppTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: { backgroundColor: '#141618', borderTopColor: '#1e2127' },
        tabBarActiveTintColor: '#4f46e5',
        tabBarInactiveTintColor: '#555',
      }}
    >
      <Tab.Screen
        name="Agenda"
        component={Home}
        options={{ tabBarIcon: ({ color }) => <Text style={{ fontSize: 20, color }}>📓</Text> }}
      />
      <Tab.Screen
        name="Compromissos"
        component={Compromissos}
        options={{ tabBarIcon: ({ color }) => <Text style={{ fontSize: 20, color }}>📋</Text> }}
      />
      <Tab.Screen
        name="Notas"
        component={Notas}
        options={{ tabBarIcon: ({ color }) => <Text style={{ fontSize: 20, color }}>📝</Text> }}
      />
      <Tab.Screen
        name="Habitos"
        component={Habitos}
        options={{ tabBarIcon: ({ color }) => <Text style={{ fontSize: 20, color }}>✅</Text> }}
      />
    </Tab.Navigator>
  )
}

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login" screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="home" component={AppTabs} />
      </Stack.Navigator>
    </NavigationContainer>
  )
}
