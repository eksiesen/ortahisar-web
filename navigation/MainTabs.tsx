import { Ionicons } from '@expo/vector-icons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import type { ComponentProps } from 'react';
import { DeviceEventEmitter } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { HomeScreen } from '../screens/HomeScreen';
import { PlacesTabScreen } from '../screens/PlacesTabScreen';
import { TransportScreen } from '../screens/TransportScreen';
import { colors } from '../theme';
import type { RootTabParamList } from './types';

const Tab = createBottomTabNavigator<RootTabParamList>();

type IconName = ComponentProps<typeof Ionicons>['name'];

function tabIcon(name: IconName) {
  return ({ color, size }: { color: string; size: number }) => (
    <Ionicons name={name} size={size - 2} color={color} />
  );
}

export function MainTabs() {
  const insets = useSafeAreaInsets();
  const bottomPad = Math.max(insets.bottom, 8);

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.tabInactive,
        tabBarStyle: {
          borderTopWidth: 1,
          borderTopColor: colors.border,
          backgroundColor: colors.tabBarBg,
          paddingTop: 4,
          paddingBottom: bottomPad,
          height: 56 + bottomPad,
        },
        tabBarLabelStyle: {
          fontSize: 10,
          fontWeight: '600',
          marginTop: -2,
        },
        tabBarHideOnKeyboard: true,
      })}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          title: 'Ana Sayfa',
          tabBarIcon: tabIcon('home'),
        }}
        listeners={({ navigation }) => ({
          tabPress: (e) => {
            if (navigation.isFocused()) {
              e.preventDefault();
              DeviceEventEmitter.emit('tabPress_Home');
            }
          },
        })}
      />
      <Tab.Screen
        name="Transport"
        component={TransportScreen}
        options={{
          title: 'Ulaşım',
          tabBarIcon: tabIcon('bus'),
        }}
        listeners={({ navigation }) => ({
          tabPress: (e) => {
            if (navigation.isFocused()) {
              e.preventDefault();
              DeviceEventEmitter.emit('tabPress_Transport');
            }
          },
        })}
      />
      <Tab.Screen
        name="Places"
        component={PlacesTabScreen}
        options={{
          title: 'Gezilecek Yerler',
          tabBarIcon: tabIcon('map'),
        }}
        listeners={({ navigation }) => ({
          tabPress: (e) => {
            if (navigation.isFocused()) {
              e.preventDefault();
              DeviceEventEmitter.emit('tabPress_Places');
            }
          },
        })}
      />
    </Tab.Navigator>
  );
}
