// src/navigation/StudentTabs.tsx
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { StudentTabParamList } from '../types';
import HomeScreen from '../screens/student/HomeScreen';
import MenuScreen from '../screens/student/MenuScreen';
import PerfilScreen from '../screens/student/PerfilScreen';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const Tab = createBottomTabNavigator<StudentTabParamList>();

export default function StudentTabs() {
  const insets = useSafeAreaInsets();
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarStyle: {
          backgroundColor: '#F8F9FA',
          borderTopLeftRadius: 12,
          borderTopRightRadius: 12,
          height: 64 + insets.bottom, // ✅ Altura + espacio seguro
          paddingBottom: insets.bottom, // ✅ Padding dinámico
          paddingTop: 12,
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          elevation: 0,
          shadowOpacity: 0,
          borderTopWidth: 0,
        },
        tabBarActiveTintColor: '#630ED4',
        tabBarInactiveTintColor: '#191C1D',
        tabBarIcon: ({ color, size, focused }) => {
          let iconName: keyof typeof MaterialCommunityIcons.glyphMap = 'home-outline';
          
          if (route.name === 'Home') iconName = focused ? 'home' : 'home-outline';
          else if (route.name === 'Menu') iconName = focused ? 'silverware-fork-knife' : 'silverware-fork-knife';
          else if (route.name === 'Perfil') iconName = focused ? 'account' : 'account-outline';
          
          return <MaterialCommunityIcons name={iconName} size={size} color={color} />;
        },
        tabBarLabelStyle: {
          fontSize: 10,
          fontWeight: '500',
          marginTop: 4,
        },
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} options={{ tabBarLabel: 'Inicio' }} />
      <Tab.Screen name="Menu" component={MenuScreen} />
      <Tab.Screen name="Perfil" component={PerfilScreen} />
    </Tab.Navigator>
  );
}