import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createStackNavigator } from "@react-navigation/stack";
import * as React from "react";
import { Image } from "react-native";

import Colors from "../constants/Colors";
import useColorScheme from "../hooks/useColorScheme";
import AccountTab from "../screens/Scanner";
import TabTwoScreen from "../screens/Account";
import {
  BottomTabParamList,
  ScannerTabParamList,
  AccountTabParamList,
} from "../types";
const ScanIcon = require("../assets/images/qr_code_scanner.png");
const AccountIcon = require("../assets/images/account.png");

const BottomTab = createBottomTabNavigator<BottomTabParamList>();

export default function BottomTabNavigator() {
  const colorScheme = useColorScheme();

  return (
    <BottomTab.Navigator
      initialRouteName="Scanner"
      tabBarOptions={{ activeTintColor: Colors[colorScheme].tint }}
    >
      <BottomTab.Screen
        name="Scanner"
        component={ScannerTabNavigator}
        options={{
          tabBarIcon: ({ color }) => (
            <Image
              source={ScanIcon}
              style={{ width: 20, height: 20, tintColor: color }}
            />
          ),
        }}
      />
      <BottomTab.Screen
        name="Account"
        component={AccountTabNavigator}
        options={{
          tabBarIcon: ({ color }) => (
            <Image
              source={AccountIcon}
              style={{ width: 24, height: 24, tintColor: color }}
            />
          ),
        }}
      />
    </BottomTab.Navigator>
  );
}

// Each tab has its own navigation stack, you can read more about this pattern here:
// https://reactnavigation.org/docs/tab-based-navigation#a-stack-navigator-for-each-tab
const ScannerTabStack = createStackNavigator<ScannerTabParamList>();

function ScannerTabNavigator() {
  return (
    <ScannerTabStack.Navigator>
      <ScannerTabStack.Screen
        name="Scanner"
        component={AccountTab}
        options={{ headerTitle: "Scanner" }}
      />
    </ScannerTabStack.Navigator>
  );
}

const AccountTabStack = createStackNavigator<AccountTabParamList>();

function AccountTabNavigator() {
  return (
    <AccountTabStack.Navigator>
      <AccountTabStack.Screen
        name="Account"
        component={TabTwoScreen}
        options={{ headerTitle: "Account" }}
      />
    </AccountTabStack.Navigator>
  );
}
