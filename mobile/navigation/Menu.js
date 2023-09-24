import { Block, Text, theme } from "galio-framework";
import { Image, ScrollView, StyleSheet } from "react-native";
import { argonTheme } from "../constants";
import { Button, DrawerItem as DrawerCustomItem } from "../components";
import React, { useEffect } from "react";
import { useAuth } from "../contexts/useAuth";
import { fetchMedecinDayConsultations } from "../components/fetchElement/fetchConsultation";
import { useUserData } from "../contexts/useUserData";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { fetchMedecinPatient } from "../components/fetchElement/fetchPatients";
import Images from "../constants/Images";
function CustomDrawerContent({
  drawerPosition,
  navigation,
  profile,
  focused,
  state,
  ...rest
}) {
  const screens = ["Home", "Profile"];
  const { logout } = useAuth()
  const { userData, updateConsultations, updateUserData, path, updatePatients } = useUserData()

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = await AsyncStorage.getItem('token');
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        const response = await axios.get(`${path}/api/users/current`);
        console.log(token)
        if (response.status === 200) {
          if (response.data.role.includes('medecin') && !response.data.role.includes('admin')) {
            fetchMedecinDayConsultations(path,response.data._id, updateConsultations);
            fetchMedecinPatient(path,response.data._id,updatePatients)
            updateUserData(response.data);
          } else {
            logout();
            navigation.navigate("Login");
            alert("Application dédiée aux medecin")
          }
        }
      } catch (error) {
        logout();
        navigation.navigate("Login");
      }
    };

    fetchUserData();
  }, []);

  const disconnect = () => {
    logout();
    navigation.navigate("Login");
  }
  return (
    <Block
      style={styles.container}
      forceInset={{ top: "always", horizontal: "never" }}
    >
      <Block center>
          <Image source={Images.LogoOnboarding} style={styles.logo} />
        </Block>
      <Block flex style={{ paddingLeft: 8, paddingRight: 14, marginTop:10 }}>
        <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
          {screens.map((item, index) => {
            return (
              <DrawerCustomItem
                title={item}
                key={index}
                navigation={navigation}
                focused={state.index === index ? true : false}
              />
            );
          })}
          <Block
            flex
            style={{ marginTop: 24, marginVertical: 8, paddingHorizontal: 8 }}
          >
            <Block
              style={{
                borderColor: "rgba(0,0,0,0.2)",
                width: "100%",
                borderWidth: StyleSheet.hairlineWidth,
              }}
            />
            {/* <Text color="#8898AA" style={{ marginTop: 16, marginLeft: 8 }}>
              DOCUMENTATION
            </Text> */}
          </Block>
          <Button color="primary" style={styles.createButton} onPress={disconnect}>
            <Text
              bold size={20}
              color={argonTheme.COLORS.WHITE}>
              LOGOUT
            </Text>
          </Button>
        </ScrollView>
      </Block>
    </Block>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "space-between",
  },
  header: {
    paddingHorizontal: 28,
    paddingBottom: theme.SIZES.BASE,
    paddingTop: theme.SIZES.BASE * 3,
    justifyContent: "center",
  },
  logo: {
    width: 250,
    height: 200,
    zIndex: 2,
    position: 'relative',
    marginTop: 20
  },
  createButton: {
    width: 250,
    alignSelf: 'baseline'
  }
});

export default CustomDrawerContent;
