import React, { useEffect, useRef, useState } from "react";
import {
    StyleSheet,
    ImageBackground,
    Dimensions,
    StatusBar,
    KeyboardAvoidingView
} from "react-native";
import { Block, Checkbox, Text, theme } from "galio-framework";
import { Button } from "../components";
import Icon from 'react-native-vector-icons/FontAwesome';
import { Images, argonTheme } from "../constants";
import { useUserData } from "../contexts/useUserData";
import axios from "axios";
import { useNavigation } from '@react-navigation/native';
import symptoms from "../constants/symptoms";
import { fetchConsultationsRdv } from "../components/fetchElement/fetchConsultation";
import SearchableDropdown from 'react-native-searchable-dropdown';
import { View, TouchableOpacity, Image } from "react-native";
import { Camera } from "expo-camera";
// import { Image } from 'expo';

import * as ImagePicker from "expo-image-picker";


const { width, height } = Dimensions.get("screen");

const New_consultation = () => {
    const [dateConsult, setdateConsult] = useState();
    const [image, setImage] = useState(null)
    const [descripSymptome, setDescripSymptome] = useState(null);
    const [successMessage, setSuccessMessage] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const { updateConsultations, consultation, patients, rdv } = useUserData()
    const [symptomes, setSyptomes] = useState([]);
    const [symp, setSymp] = useState(new Set());
    const navigation = useNavigation();
    const [ok, setOk] = useState(true)
    const [hasPermission, setHasPermission] = useState(null);
    const [cameraType, setCameraType] = useState(Camera.Constants.Type.back);
    const [isPreview, setIsPreview] = useState(false);
    const [capturedImage, setCapturedImage] = useState(null);
    const cameraRef = useRef(null);




    ///////////////////////////// lancer le diagnostic///////////////
    const handlerDiagnostic = async (consult_id) => {
        try {
            const response = await axios.put(`http://192.168.11.104:5000/api/consult/diagnostic/${consult_id}`);
            if (response.status == 200) {
                console.log('treatment done successfully !!!!');
                fetchConsultationsRdv(rdv._id, updateConsultations);
                navigation.navigate("Home");
            }
        } catch (error) {
            setErrorMessage("Error during image treatment");
            setSuccessMessage("");
        }
    }

    //////////////////////////// image consultation \\\\\\\\\\\\\\\\
    const createImage = async (consult) => {
        const formData = new FormData();
        formData.append('image', {
            uri: capturedImage.uri,
            name: `${new Date(consult.dateConsult).getHours()}_${String(new Date(consult.dateConsult).getMinutes()).padStart(2, '0')}_${String(new Date(consult.dateConsult).getSeconds()).padStart(2, '0')}.jpg`,
            type: 'image/jpeg',
        });
        try {
            const response = await axios.put(`http://192.168.11.104:5000/api/consultation/upload-image/${consult._id}`,
                formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            }
            )
            if (response.status === 200) {
                console.log("le diagnostic : ", response.data)
                handlerDiagnostic(response.data._id)
                // fetchConsultationsRdv(rdv._id, updateConsultations);
            }
        }
        catch (err) {
            console.log("Echec de l'enregistrement de l'image");
            setErrorMessage("Error during image uploading");
            setSuccessMessage("");
        }
    }

    ////////////////////// soumission formulaire ////////////////////
    const handleSubmit = async () => {
        const currentDateTime = new Date();
        setdateConsult(currentDateTime);
        console.log(descripSymptome)

        try {
            const response = await axios.post(
                `http://192.168.11.104:5000/api/consultations/create/${rdv._id}`,
                {
                    "dateConsult": currentDateTime,
                    descripSymptome
                }
            );

            if (response.status === 200) {
                const consultation = response.data;
                if (capturedImage) {
                    createImage(consultation);
                }
                console.log("Nouveau consultation enregistré :", consultation);
                // setSuccessMessage("Registration successful!");
                setErrorMessage("");
            }
        } catch (error) {
            console.error("Erreur lors de l'enregistrement de la consultation", error);
            setErrorMessage("Error during registration. Please try again.");
            setSuccessMessage("");

        }
    };

    useEffect(() => {
        (async () => {
            const { status } = await Camera.requestCameraPermissionsAsync();
            setHasPermission(status === "granted");
        })();
    }, []);

    const handleCameraType = () => {
        setCameraType(
            cameraType === Camera.Constants.Type.back
                ? Camera.Constants.Type.front
                : Camera.Constants.Type.back
        );
    };

    const takePicture = async () => {
        if (!isPreview) {
            if (cameraRef.current) {
                const photo = await cameraRef.current.takePictureAsync();
                console.log(photo);
                setIsPreview(true);
                setCapturedImage(photo);
                setOk(false)
            }
        }
    };


    const cancelPreview = () => {
        setIsPreview(false);
        setCapturedImage(null);
    };

    if (hasPermission === null) {
        return <View />;
    }
    if (hasPermission === false) {
        return <Text>No access to camera</Text>;
    }

    const pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });

        console.log(result);

        if (!result.canceled) {
            setCapturedImage(result.assets[0]);
            setOk(false)
        }
    };

    const handleItemSelect = (item) => {
        // Update the selected items state
        setSyptomes((prevSelectedItems) => {
            const newSelectedItems = [...prevSelectedItems, item];
            const selectedValues = newSelectedItems.map((item) => item.name);
            setDescripSymptome(selectedValues);
            return newSelectedItems; // Retourne la nouvelle liste mise à jour
        });
        // console.log(descripSymptome)
    };

    const handleItemDeselect = (item) => {
        // Update the selected items state
        setSyptomes((prevSelectedItems) =>
            prevSelectedItems.filter((selectedItem) => selectedItem !== item));
        const selectedValues = symptomes.map((item) => item.name);
        setDescripSymptome(selectedValues);
        // console.log(descripSymptome)
    };

    return (

        <>
            {ok ?
                <>
                    <View style={{ flex: 1 }}>
                        {isPreview ? (
                            <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
                                <TouchableOpacity onPress={cancelPreview} style={{ marginBottom: 20 }}>
                                    <Text style={{ color: "white" }}>Cancel</Text>
                                </TouchableOpacity>
                                {/* <Image source={{ uri: capturedImage.uri }} style={{ width: 300, height: 400 }} /> */}
                            </View>
                        ) : (
                            <Camera
                                ref={cameraRef}
                                style={{ flex: 1 }}
                                type={cameraType}
                            >
                                <View
                                    style={{
                                        flex: 1,
                                        backgroundColor: "transparent",
                                        flexDirection: "row",
                                        justifyContent: 'space-between'
                                    }}
                                >
                                    <TouchableOpacity
                                        style={{
                                            flex: 0.1,
                                            alignSelf: "flex-end",
                                            alignItems: "center",
                                            marginBottom: 20
                                        }}
                                        onPress={handleCameraType}
                                    >
                                        <Icon
                                            name="retweet"
                                            size={30}
                                            style={{ fontSize: 25, marginBottom: 10, color: "white" }} />
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                        style={{
                                            flex: 0.2,
                                            alignSelf: "flex-end",
                                            alignItems: "center",
                                            marginBottom: 10,
                                        }}
                                        onPress={takePicture}
                                    >
                                        <Icon
                                            name="camera"
                                            size={40}
                                            style={{ fontSize: 60, color: "white" }} />
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                        style={{
                                            flex: 0.1,
                                            alignSelf: "flex-end",
                                            alignItems: "center",
                                            marginBottom: 20
                                        }}
                                        onPress={pickImage}
                                    >
                                        <Icon
                                            name="image"
                                            size={30}
                                            style={{ fontSize: 25, marginBottom: 10, color: "white" }} />
                                    </TouchableOpacity>
                                </View>
                            </Camera>
                        )}
                    </View>
                </> :
                <Block flex middle style={{ justifyContent: 'center' }}>
                    <StatusBar hidden />
                    <ImageBackground
                        source={Images.RegisterBackground}
                        style={{ width, height, zIndex: 1 }}
                    >
                        <Block safe flex middle>
                            {successMessage && <Text style={{ color: 'green', fontSize: '30px' }}>{successMessage}</Text>}
                            {errorMessage && <Text style={{ color: 'red', fontSize: '30px' }}>{errorMessage}</Text>}
                            <Block style={styles.registerContainer}>
                                <Block flex>
                                    <Block flex={0.17} middle>
                                        <Text color="#8898AA" size={30}>
                                            New consultation
                                        </Text>
                                    </Block>
                                    <Block flex center style={{ justifyContent: "center", alignContent: "center" }}>
                                        <KeyboardAvoidingView
                                            style={{ flex: 1 }}
                                            behavior="padding"
                                            enabled
                                        >
                                            <Block width={width * 0.8} center>
                                                <Image source={{ uri: capturedImage.uri }} style={{ width: 300, height: 200 }} />
                                                <Button onPress={handleSubmit}><Text>Confirm</Text></Button>
                                            </Block>
                                            <Block width={width * 0.8} style={{ marginBottom: 5, marginTop: 20 }}>
                                                <SearchableDropdown
                                                    multi={true} // Enables multi-select
                                                    selectedItems={symptomes}
                                                    onItemSelect={handleItemSelect}
                                                    containerStyle={{ padding: 5 }}
                                                    itemStyle={{
                                                        padding: 10,
                                                        marginTop: 2,
                                                        backgroundColor: '#ddd',
                                                        borderColor: '#bbb',
                                                        borderWidth: 1,
                                                        borderRadius: 5,
                                                    }}
                                                    itemTextStyle={{ color: '#222' }}
                                                    itemsContainerStyle={{ maxHeight: 190 }}
                                                    items={symptoms}
                                                    defaultIndex={0}
                                                    placeholder="Select symptoms"
                                                    resetValue={false}
                                                    textInputProps={{
                                                        onChangeText: (text) => {
                                                            console.log(text)
                                                        },
                                                    }}
                                                />
                                                {symptomes.map((item) => (
                                                    <TouchableOpacity key={item.id} onPress={() => handleItemDeselect(item)}>
                                                        <Text>{item.name} - Deselect</Text>
                                                    </TouchableOpacity>
                                                ))}
                                            </Block>
                                        </KeyboardAvoidingView>
                                    </Block>
                                </Block>
                            </Block>
                        </Block>
                    </ImageBackground>
                </Block>

            }
        </>
    );
}

const styles = StyleSheet.create({
    registerContainer: {
        width: width * 0.9,
        height: height * 0.875,
        backgroundColor: "#F4F5F7",
        borderRadius: 4,
        shadowColor: argonTheme.COLORS.BLACK,
        shadowOffset: {
            width: 0,
            height: 4
        },
        shadowRadius: 8,
        shadowOpacity: 0.1,
        elevation: 1,
        overflow: "hidden"
    },
    socialConnect: {
        backgroundColor: argonTheme.COLORS.WHITE,
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderColor: "#8898AA"
    },
    socialButtons: {
        width: 120,
        height: 40,
        backgroundColor: "#fff",
        shadowColor: argonTheme.COLORS.BLACK,
        shadowOffset: {
            width: 0,
            height: 4
        },
        shadowRadius: 8,
        shadowOpacity: 0.1,
        elevation: 1
    },
    socialTextButtons: {
        color: argonTheme.COLORS.PRIMARY,
        fontWeight: "800",
        fontSize: 14
    },
    inputIcons: {
        marginRight: 12
    },
    passwordCheck: {
        paddingLeft: 15,
        paddingTop: 13,
        paddingBottom: 30
    },
    createButton: {
        width: width * 0.5,
        marginTop: 25
    }
});

export default New_consultation;
