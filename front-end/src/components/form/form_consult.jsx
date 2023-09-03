
import React, { useEffect, useState } from "react";
import { Modal, Button, Nav } from 'react-bootstrap';
import axios from "axios"; // Import Axios
import "./form.css";
import { Link, Navigate } from "react-router-dom";
import { useUserData } from "../../contexts/UserDataContext";
import { fetchConsultationsRdv } from "../fetchElement/fetchConsultations";
import symptoms from "../../constants/list_symptoms";
import Select from "react-select";


function Form_consultation({ open, rdv_id, consultationToUpdate }) {
    const [modalIsOpen, setModalIsOpen] = useState(open);
    const [dateConsult, setdateConsult] = useState();
    const [image, setImage] = useState()
    const [description, setDescription] = useState("")
    const [prescription, setPrescription] = useState("")
    const [prescriptions, setPrescriptions] = useState([])
    const [descripSymptome, setDescripSymptome] = useState(null);
    const [successMessage, setSuccessMessage] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const { updateConsultations, consultations, patients } = useUserData()
    const [bouton, setBouton] = useState("save")
    const [symptomes, setSyptomes] = useState([])


    useEffect(() => {
        if (consultationToUpdate) {
            setBouton("update")
            setdateConsult(consultationToUpdate.dateConsult ? new Date(consultationToUpdate.dateConsult).toISOString().split('T')[0] : "");
            setDescripSymptome(consultationToUpdate.descripSymptome || "")
        }
    }, [consultationToUpdate]);

    ///////////////////////////// lancer le diagnostic///////////////
    const handlerDiagnostic = async (consult_id) => {
        try {
            const response = await axios.put(`http://192.168.11.104:5000/api/consult/diagnostic/${consult_id}`);
            if (response.status == 200) {
                console.log('treatment done successfully !!!!');
                fetchConsultationsRdv(rdv_id, updateConsultations);
                setModalIsOpen(false);
            }
        } catch (error) {

        }
    }

    //////////////////////////// image consultation \\\\\\\\\\\\\\\\
    const createImage = async (consult_id, image) => {
        const formData = new FormData();
        formData.append("image", image);
        try {
            const response = await axios.put(`http://192.168.11.104:5000/api/consultation/upload-image/${consult_id}`,
                formData
            )
            if (response.status === 200) {
                console.log("le diagnostic : ", response.data)
                handlerDiagnostic(consult_id)
                fetchConsultationsRdv(rdv_id, updateConsultations);
            }
        }
        catch (err) {
            console.log("Echec de l'enregistrement de l'image")
        }
    }

    ////////////////////// soumission formulaire ////////////////////
    const handleSubmit = async (e) => {
        e.preventDefault();

        setSuccessMessage("please wait for the disease detection")
        const currentDateTime = new Date();
        setdateConsult(currentDateTime);
        console.log(currentDateTime)

        try {
            if (consultationToUpdate) {
                try {
                    const response = await axios.put(
                        `http://192.168.11.104:5000/api/consultation/update/${consultationToUpdate._id}`,
                        {
                            description,
                            "prescription":prescriptions
                        }
                    );

                    if (response.status === 201) {
                        const consultation = response.data;
                        console.log("update consultation done :", consultation);
                        setErrorMessage("");
                        fetchConsultationsRdv(rdv_id, updateConsultations);
                        setModalIsOpen(false);
                    }
                } catch (error) {
                    console.error("Erreur lors de l'enregistrement du rendez vous", error);
                    setErrorMessage("Error during updating. Please try again.");
                    setSuccessMessage("");

                }

            } else {
                try {
                    const response = await axios.post(
                        `http://192.168.11.104:5000/api/consultations/create/${rdv_id}`,
                        {
                            dateConsult,
                            "descripSymptome": symptomes
                        }
                    );

                    if (response.status === 200) {
                        const consultation = response.data;
                        if (image) {
                            createImage(consultation._id, image);
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
            }
        } catch (error) {

        }
    };

    const handleSelectChange = (descripSymptome) => {
        const selectedValues = descripSymptome.map((item) => item.label);
        setSyptomes(selectedValues);
        setDescripSymptome(descripSymptome);
        console.log(descripSymptome)
    };

    const handleInputChange = (e) => {
        const { name, value, type, files } = e.target;

        switch (name) {
            case "dateConsult":
                setdateConsult(value);
                break;
            case "prescription":
                const prescriptionArray = value.split(",");
                setPrescriptions(prescriptionArray);
                setPrescription(value)
                break;
            case "descripSymptome":
                setDescripSymptome(value);
                break;
            case "description":
                setDescription(value);
                break;
            case "image":
                if (type === "file" && files && files.length > 0) {
                    setImage(files[0]);
                }
                break;
            default:
                break;
        }
    };

    const handleCloseModal = () => {
        setModalIsOpen(false);
    }

    return (
        <Modal show={modalIsOpen} onHide={handleCloseModal} size="lg">
            <form onSubmit={handleSubmit}>
                <Modal.Header closeButton>
                    <Modal.Title>CONSULTATION FORM</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {successMessage && <p className="success-message">{successMessage}</p>}
                    {errorMessage && <p className="error-message">{errorMessage}</p>}
                    {consultationToUpdate && <>
                        <div className="form-field">
                            <label>DISEASE DESCRIPTION</label>
                            <input
                                type="text"
                                name="description"
                                value={description}
                                onChange={handleInputChange}
                                required
                            />
                        </div>
                        <div className="form-field">
                            <label>REQUIREMENT</label>
                            <textarea
                                type="text"
                                name="prescription"
                                value={prescription}
                                onChange={handleInputChange}
                                with={150}
                            />
                        </div>
                    </>}
                    {!consultationToUpdate &&
                        <div className="form-field">
                            <h4>Choose symptoms : </h4>
                            <Select
                                options={symptoms}
                                value={descripSymptome}
                                onChange={handleSelectChange}
                                isMulti
                                isSearchable
                                placeholder="Select symptoms..."
                            />
                            <ul>
                                {descripSymptome && descripSymptome.map((option) => (
                                    <li key={option.value}>{option.label}</li>
                                ))}
                            </ul>
                        </div>}

                    {!consultationToUpdate && <div className="form-field">
                        <label>IMAGE</label>
                        <input
                            type="file"
                            name="image"
                            accept="image/*"
                            onChange={handleInputChange}
                            required
                        />
                    </div>}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleCloseModal}>
                        Close
                    </Button>
                    <Button id="sub_btn" type="submit">
                        {bouton}
                    </Button>
                </Modal.Footer>
            </form>
        </Modal>
    );
}

export default Form_consultation;
