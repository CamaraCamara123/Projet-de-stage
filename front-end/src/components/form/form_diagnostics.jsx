
import React, { useEffect, useState } from "react";
import { Modal, Button, Nav } from 'react-bootstrap';
import axios from "axios"; // Import Axios
import "./form.css";
import { Link, Navigate } from "react-router-dom";
import { useUserData } from "../../contexts/UserDataContext";
import symptoms from "../../constants/list_symptoms";
import Select from "react-select";
import { fetchConsultationDiagnostic } from "../fetchElement/fetchDiagnostic";


function Form_diagnostics({ open, consult_id, diagnosticToUpdate }) {
    const [modalIsOpen, setModalIsOpen] = useState(open);
    const [dateDiagnostic, setdateDiagnostic] = useState();
    const [image, setImage] = useState()
    const [description, setDescription] = useState("")
    const [prescription, setPrescription] = useState("")
    const [prescriptions, setPrescriptions] = useState([])
    const [descripSymptome, setDescripSymptome] = useState(null);
    const [successMessage, setSuccessMessage] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const { updateDiagnostics, path } = useUserData()
    const [bouton, setBouton] = useState("save")
    const [symptomes, setSyptomes] = useState([])


    useEffect(() => {
        if (diagnosticToUpdate) {
            setBouton("update")
            setdateDiagnostic(diagnosticToUpdate.dateDiagnostic ? new Date(diagnosticToUpdate.dateDiagnostic).toISOString().split('T')[0] : "");
            setDescripSymptome(diagnosticToUpdate.descripSymptome || "")
        }
    }, [diagnosticToUpdate]);

    ///////////////////////////// lancer le diagnostic///////////////
    const handlerDiagnostic = async (diagnostic_id) => {
        try {
            const token = localStorage.getItem('token');
            axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
            const response = await axios.put(`${path}/api/consult/diagnostic/${diagnostic_id}`);
            if (response.status == 200) {
                console.log('treatment done successfully !!!!');
                fetchConsultationDiagnostic(path, consult_id, updateDiagnostics);
                setModalIsOpen(false);
            }
        } catch (error) {

        }
    }

    //////////////////////////// image diagnostic \\\\\\\\\\\\\\\\
    const createImage = async (diagnostic_id, image) => {
        const formData = new FormData();
        formData.append("image", image);
        try {
            const token = localStorage.getItem('token');
            axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
            const response = await axios.put(`${path}/api/diagnostic/upload-image/${diagnostic_id}`,
                formData
            )
            if (response.status === 200) {
                console.log("le diagnostic : ", response.data)
                handlerDiagnostic(diagnostic_id)
                fetchConsultationDiagnostic(path, consult_id, updateDiagnostics);
            }
        }
        catch (err) {
            console.log("Echec de l'enregistrement de l'image")
        }
    }

    ////////////////////// soumission formulaire ////////////////////
    const handleSubmit = async (e) => {
        e.preventDefault();



        try {
            if (diagnosticToUpdate) {
                try {
                    const token = localStorage.getItem('token');
                    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
                    const response = await axios.put(
                        `${path}/api/diagnostic/update/${diagnosticToUpdate._id}`,
                        {
                            description,
                            "prescription": prescriptions
                        }
                    );

                    if (response.status === 200) {
                        const diagnostic = response.data;
                        console.log("update diagnostic done :", diagnostic);
                        setErrorMessage("");
                        fetchConsultationDiagnostic(path, consult_id, updateDiagnostics);
                        setModalIsOpen(false);
                    }
                } catch (error) {
                    console.error("Erreur lors de l'enregistrement du diagnostic", error);
                    setErrorMessage("Error during updating. Please try again.");
                    setSuccessMessage("");

                }

            } else {
                setSuccessMessage("please wait for the disease detection")
                setErrorMessage("")
                try {
                    const token = localStorage.getItem('token');
                    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
                    const response = await axios.post(
                        `${path}/api/diagnostic/create/${consult_id}`,
                        {
                            "descripSymptome": symptomes
                        }
                    );

                    if (response.status === 200) {
                        const diagnostic = response.data;
                        if (image) {
                            createImage(diagnostic._id, image);
                        }
                        console.log("Nouveau diagnostic enregistré :", diagnostic);
                        // setSuccessMessage("Registration successful!");
                        setErrorMessage("");
                    }
                } catch (error) {
                    console.error("Erreur lors de l'enregistrement de la diagnostic", error);
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
            case "dateDiagnostic":
                setdateDiagnostic(value);
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
                    <Modal.Title>DIAGNOSTIC FORM</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {successMessage && <p className="success-message">{successMessage}</p>}
                    {errorMessage && <p className="error-message">{errorMessage}</p>}
                    {diagnosticToUpdate && <>
                        <div className="form-field" style={{ justifyContent: 'space-between' }}>
                            <label>DISEASE DESCRIPTION</label>
                            <input
                                type="text"
                                name="description"
                                value={description}
                                onChange={handleInputChange}
                                required
                            />
                        </div>
                        <div className="form-field" style={{ justifyContent: 'space-between' }}>
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
                    {!diagnosticToUpdate &&
                        <div className="form-field" style={{ justifyContent: 'space-between' }}>
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

                    {!diagnosticToUpdate && <div className="form-field" style={{ justifyContent: 'space-between' }}>
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

export default Form_diagnostics;