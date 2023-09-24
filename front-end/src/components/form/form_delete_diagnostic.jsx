import React, { useState } from "react";
import { Modal, Button } from 'react-bootstrap';
import axios from "axios"; // Import Axios
import "./form.css";
import { useUserData } from "../../contexts/UserDataContext";
import { fetchConsultationDiagnostic } from "../fetchElement/fetchDiagnostic";
import { useNavigate } from 'react-router-dom';
import Loading from "../../constants/loading";


function Form__delete_diagnostic({ open, diagnosticToDelete }) {
    const [modalIsOpen, setModalIsOpen] = useState(open);
    const [successMessage, setSuccessMessage] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const { updateDiagnostics, path } = useUserData()
    const navigate = useNavigate();
    const [ok, setOk] = useState(false);



    const handleDelete = async () => {
        setOk(true)
        try {
            const token = localStorage.getItem('token');
            axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
            const response = await axios.delete(
                `${path}/api/diagnostic/delete/${diagnosticToDelete._id}`
            );

            if (response.status === 200) {
                fetchConsultationDiagnostic(path, diagnosticToDelete.consultation._id, updateDiagnostics)
                setSuccessMessage("diagnostic deleted successfully!");
                setErrorMessage("");
                setModalIsOpen(false);
            }
        } catch (error) {
            console.error("Error deleting diagnostic", error);
            setErrorMessage("Error deleting rendez-vous. Please try again.");
            setSuccessMessage("");
            navigate('/login')
        }
    };

    const handleCloseModal = () => {
        setModalIsOpen(false);
    }

    return (
        <Modal show={modalIsOpen} onHide={handleCloseModal}>
            {ok && <Loading />}
            {!ok && <><Modal.Header closeButton>
                <Modal.Title>Deletion Confirmation</Modal.Title>
            </Modal.Header>
                <Modal.Body>
                    <p>Are you sure to delete this diagnostic?</p>
                    {successMessage && <p className="success-message">{successMessage}</p>}
                    {errorMessage && <p className="error-message">{errorMessage}</p>}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleCloseModal}>
                        Close
                    </Button>
                    <Button onClick={handleDelete} className="btn-supp1">
                        Confirm
                    </Button>
                </Modal.Footer>
            </>}
        </Modal>
    );
}

export default Form__delete_diagnostic;
