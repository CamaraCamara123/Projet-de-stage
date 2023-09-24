
import React, { useEffect, useState } from "react";
import { Modal, Button, Nav } from 'react-bootstrap';
import axios from "axios"; // Import Axios
import "./form.css";
import { Link, Navigate } from "react-router-dom";
import { useUserData } from "../../contexts/UserDataContext";
// import { fetchConsultationsRdv } from "../fetchElement/fetchConsultations";
import symptoms from "../../constants/list_symptoms";
import Select from "react-select";
// import { fetchMedecinRdvs, fetchRdvs } from "../fetchElement/fetchRdvs";
// import { Week, Month, Day, WorkWeek, TimelineViews, TimelineMonth, Agenda, ScheduleComponent, Inject } from '@syncfusion/ej2-react-schedule';
import '@syncfusion/ej2-base/styles/material.css';
import '@syncfusion/ej2-react-buttons/styles/material.css';
import '@syncfusion/ej2-react-calendars/styles/material.css';
import '@syncfusion/ej2-react-dropdowns/styles/material.css';
import '@syncfusion/ej2-react-inputs/styles/material.css';
import '@syncfusion/ej2-react-popups/styles/material.css';
import '@syncfusion/ej2-react-schedule/styles/material.css';



function Form_consultation({ open, consultationToUpdate }) {
    const [modalIsOpen, setModalIsOpen] = useState(open);
    const [successMessage, setSuccessMessage] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const { updateConsultations,} = useUserData()
    const { medecins, path} = useUserData();
    const [medecin, setMedecin] = useState([])
    const [doctors, setDoctors] = useState();


    ////////////////////// soumission formulaire ////////////////////
    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await axios.put(
                `${path}/api/consultation/update/${consultationToUpdate._id}/${medecin._id}`
            );

            if (response.status === 201) {
                const consultation = response.data;
                console.log("update consultation done :", consultation);
                setErrorMessage("");
                // fetchConsultationsRdv(path,consultationToUpdate.rdv._id, updateConsultations);
                setModalIsOpen(false);
            }
        } catch (error) {
            console.error("Erreur lors de l'enregistrement du rendez vous", error);
            setErrorMessage("Error during updating. Please try again.");
            setSuccessMessage("");

        }

    }

    useEffect(() => {
        const fetchDoctors = async () => {
            const listDoctor = [];
            for (let medecin of medecins) {
                listDoctor.push({ value: `${medecin.tel}`, label: `${medecin.nom} ${medecin.prenom}` })
            }
            await setDoctors(listDoctor);
        };
        fetchDoctors();
    }, [medecins]);

    const handleSelectChange = (item) => {
        for (let doc of medecins) {
            if (doc.tel == item.value) {
                setMedecin(doctors[doc.tel])
            }
        }
    };

    const handleCloseModal = () => {
        setModalIsOpen(false);
    }

    return (
        <Modal show={modalIsOpen} onHide={handleCloseModal} size="lg">
            <form onSubmit={handleSubmit}>
                <Modal.Header closeButton>
                    <Modal.Title>SUBSTITUTE DOCTOR </Modal.Title>
                </Modal.Header>
                <Modal.Body style={{justifyContent:'center', textAlign:'center'}}>
                    {successMessage && <p className="success-message">{successMessage}</p>}
                    {errorMessage && <p className="error-message">{errorMessage}</p>}
                    <div className="form-field">
                        <h4>Choose Doctor : </h4>
                        <Select
                            options={doctors}
                            value={medecin}
                            onChange={(item) => handleSelectChange(item)}
                            isSearchable
                            placeholder="Select a doctor..."
                        />
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleCloseModal}>
                        Close
                    </Button>
                    <Button id="sub_btn" type="submit">
                        Confirm
                    </Button>
                </Modal.Footer>
            </form>
        </Modal>
    );
}

export default Form_consultation;
