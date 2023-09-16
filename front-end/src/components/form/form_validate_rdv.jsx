import React, { useState } from "react";
import { Modal, Button } from 'react-bootstrap';
import axios from "axios"; // Import Axios
import "./form.css";
import { Link, Navigate } from "react-router-dom";
import { fetchMedecinRdvs, fetchPatientRdvs, fetchRdvs } from "../fetchElement/fetchRdvs";
import { useUserData } from "../../contexts/UserDataContext";

function Form__validate_rdv({ open, rdvToValidate }) {
    const [modalIsOpen, setModalIsOpen] = useState(open);
    const [successMessage, setSuccessMessage] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const { updateRdvs, path } = useUserData();

    const onvalidate = () => {
        setModalIsOpen(false);
    }
    const handlevalidate = async () => {
        try {
            const token = localStorage.getItem('token');
            axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
            const response = await axios.post(
                `${path}/api/consultation/create/${rdvToValidate._id}`, {
                    headers: {
                      'Content-Type': 'application/json'
                    }}
            );

            if (response.status === 200) {

                fetchPatientRdvs(path,rdvToValidate.patient._id,updateRdvs)
                setSuccessMessage("rendez-vous validated successfully!");
                setErrorMessage("");
                onvalidate();
            }
        } catch (error) {
            console.error("Error deleting rendez-vous", error);
            setErrorMessage("Error validating appointment. Please try again.");
            setSuccessMessage("");
        }
    };

    const handleCloseModal = () => {
        setModalIsOpen(false);
    }

    return (
        <Modal show={modalIsOpen} onHide={handleCloseModal}>
            <Modal.Header closeButton>
                <Modal.Title>appointment Confirmation</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <p style={{ textAlign: 'center', justifyContent: 'center' }}>Are you sure to validate this appointment?</p>
                {successMessage && <p className="success-message" style={{ textAlign: 'center', justifyContent: 'center' }}>{successMessage}</p>}
                {errorMessage && <p className="error-message" style={{ textAlign: 'center', justifyContent: 'center' }}>{errorMessage}</p>}
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={handleCloseModal}>
                    Close
                </Button>
                <Button onClick={handlevalidate} className="btn-supp1">
                    Confirm
                </Button>
            </Modal.Footer>
        </Modal>
    );
}

export default Form__validate_rdv;
