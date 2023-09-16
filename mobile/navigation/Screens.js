import { Animated, Dimensions, Easing } from "react-native";
// header for screens
import { Header, Icon } from "../components";

// drawer
import CustomDrawerContent from "./Menu";
// screens
import Home from "../screens/Home";
import Onboarding from "../screens/Onboarding";
import Profile from "../screens/Profile";
import React from "react";
import Register from "../screens/Register";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { createStackNavigator } from "@react-navigation/stack";
import New_Diagnostic from "../screens/New_Diagnostic";
import Diagnostics from "../screens/Diagnostics";
import Details_diagnostic from "../screens/Details_diagnostic";

const { width } = Dimensions.get("screen");

const Stack = createStackNavigator();
const Drawer = createDrawerNavigator();
const Tab = createBottomTabNavigator();

// function ElementsStack(props) {
//   return (
//     <Stack.Navigator
//       screenOptions={{
//         mode: "card",
//         headerShown: false,
//       }}
//     >
//       <Stack.Screen
//         name="Elements"
//         component={Elements}
//         options={{
//           header: ({ navigation, scene }) => (
//             <Header title="Elements" navigation={navigation} scene={scene} />
//           ),
//           cardStyle: { backgroundColor: "#F8F9FE" },
//         }}
//       />
//       {/* <Stack.Screen
//         name="Pro"
//         component={Pro}
//         options={{
//           header: ({ navigation, scene }) => (
//             <Header
//               title=""
//               back
//               white
//               transparent
//               navigation={navigation}
//               scene={scene}
//             />
//           ),
//           headerTransparent: true,
//         }}
//       /> */}
//     </Stack.Navigator>
//   );
// }

// function ArticlesStack(props) {
  
//   return (
//     <Stack.Navigator
//       screenOptions={{
//         mode: "card",
//         headerShown: "screen",
//       }}
//     >
//       <Stack.Screen
//         name="Articles"
//         component={Articles}
//         options={{
//           header: ({ navigation, scene }) => (
//             <Header title="Articles" navigation={navigation} scene={scene} />
//           ),
//           cardStyle: { backgroundColor: "#F8F9FE" },
//         }}
//       />
//       <Stack.Screen
//         name="Pro"
//         component={Pro}
//         options={{
//           header: ({ navigation, scene }) => (
//             <Header
//               title=""
//               back
//               white
//               transparent
//               navigation={navigation}
//               scene={scene}
//             />
//           ),
//           headerTransparent: true,
//         }}
//       />
//     </Stack.Navigator>
//   );
// }

function ProfileStack(props) {
  return (
    <Stack.Navigator
      initialRouteName="Profile"
      screenOptions={{
        mode: "card",
        headerShown: "screen",
      }}
    >
      <Stack.Screen
        name="Profile"
        component={Profile}
        options={{
          header: ({ navigation, scene }) => (
            <Header
              transparent
              white
              title="Profile"
              navigation={navigation}
              scene={scene}
            />
          ),
          cardStyle: { backgroundColor: "#FFFFFF" },
          headerTransparent: true,
        }}
      />
      {/* <Stack.Screen
        name="Pro"
        component={Pro}
        options={{
          header: ({ navigation, scene }) => (
            <Header
              title=""
              back
              white
              transparent
              navigation={navigation}
              scene={scene}
            />
          ),
          headerTransparent: true,
        }}
      /> */}
    </Stack.Navigator>
  );
}

function HomeStack(props) {
  return (
    <Stack.Navigator
      screenOptions={{
        mode: "card",
        headerShown: "screen",
      }}
    >
      <Stack.Screen
        name="Home"
        component={Home}
        options={{
          header: ({ navigation, scene }) => (
            <Header
              title="Visits"
              navigation={navigation}
              scene={scene}
            />
          ),
          cardStyle: { backgroundColor: "#F8F9FE" },
        }}
      />
      <Stack.Screen
        name="New_Diagnostic"
        component={New_Diagnostic}
        options={{
          header: ({ navigation, scene }) => (
            <Header
              title="back"
              back
              black
              transparent
              navigation={navigation}
              scene={scene}
            />
          ),
          headerTransparent: true,
        }}
      />
      <Stack.Screen
        name="diagnostics"
        component={Diagnostics}
        options={{
          header: ({ navigation, scene }) => (
            <Header
              title=""
              back
              black
              transparent
              navigation={navigation}
              scene={scene}
            />
          ),
          headerTransparent: true,
        }}
      />
      <Stack.Screen
        name="details_diagnostic"
        component={Details_diagnostic}
        options={{
          header: ({ navigation, scene }) => (
            <Header
              title=""
              back
              black
              transparent
              navigation={navigation}
              scene={scene}
            />
          ),
          headerTransparent: true,
        }}
      />
    </Stack.Navigator>
  );
}

export default function OnboardingStack(props) {
  return (
    <Stack.Navigator
      screenOptions={{
        mode: "card",
        headerShown: false,
      }}
    >
      <Stack.Screen
        name="Onboarding"
        component={Onboarding}
        option={{
          headerTransparent: true,
        }}
      />
      <Stack.Screen name="Login" component={LoginStack} />
    </Stack.Navigator>
  );
}

function LoginStack(props) {
  return (
    <Stack.Navigator
      screenOptions={{
        mode: "card",
        headerShown: false,
      }}
    >
      <Stack.Screen
        name="Login"
        component={Register}
        option={{
          headerTransparent: true,
        }}
      />
      <Stack.Screen name="App" component={AppStack} />
    </Stack.Navigator>
  );
}

function AppStack(props) {
  return (
    <Drawer.Navigator
      style={{ flex: 1 }}
      drawerContent={(props) => <CustomDrawerContent {...props} />}
      drawerStyle={{
        backgroundColor: "white",
        width: width * 0.8,
      }}
      drawerContentOptions={{
        activeTintcolor: "white",
        inactiveTintColor: "#000",
        activeBackgroundColor: "transparent",
        itemStyle: {
          width: width * 0.75,
          backgroundColor: "transparent",
          paddingVertical: 16,
          paddingHorizonal: 12,
          justifyContent: "center",
          alignContent: "center",
          alignItems: "center",
          overflow: "hidden",
        },
        labelStyle: {
          fontSize: 18,
          marginLeft: 12,
          fontWeight: "normal",
        },
      }}
      initialRouteName="Home"
    >
      <Drawer.Screen
        name="Home"
        component={HomeStack}
        options={{
          headerShown: false,
        }}
      />
      <Drawer.Screen
        name="Profile"
        component={ProfileStack}
        options={{
          headerShown: false,
        }}
      />
      <Drawer.Screen
        name="Account"
        component={Register}
        options={{
          headerShown: false,
        }}
      />
      {/* <Drawer.Screen
        name="Elements"
        component={ElementsStack}
        options={{
          headerShown: false,
        }}
      /> */}
      {/* <Drawer.Screen
        name="Articles"
        component={ArticlesStack}
        options={{
          headerShown: false,
        }}
      /> */}
    </Drawer.Navigator>
  );
}
