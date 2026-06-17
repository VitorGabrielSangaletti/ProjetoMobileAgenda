import { NavigationContainer } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { Ionicons } from '@expo/vector-icons'

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
        options={{ tabBarIcon: ({ color, size }) => <Ionicons name="calendar-outline" size={size} color={color} /> }}
      />
      <Tab.Screen
        name="Compromissos"
        component={Compromissos}
        options={{ tabBarIcon: ({ color, size }) => <Ionicons name="checkmark-circle-outline" size={size} color={color} /> }}
      />
      <Tab.Screen
        name="Notas"
        component={Notas}
        options={{ tabBarIcon: ({ color, size }) => <Ionicons name="document-text-outline" size={size} color={color} /> }}
      />
      <Tab.Screen
        name="Habitos"
        component={Habitos}
        options={{ tabBarIcon: ({ color, size }) => <Ionicons name="checkbox-outline" size={size} color={color} /> }}
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