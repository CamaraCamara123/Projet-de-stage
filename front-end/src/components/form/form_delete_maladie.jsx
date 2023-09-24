import React, { useState } from "react";
import { Modal, Button } from 'react-bootstrap';
import axios from "axios"; // Import Axios
import "./form.css";
import { Link, Navigate } from "react-router-dom";
import { useUserData } from "../../contexts/UserDataContext";
import { fetchMaladies } from "../fetchElement/fetchMaladies";
import { useNavigate } from 'react-router-dom';
import Loading from "../../constants/loading";

function Form_delete_maladie({ open, maladieToDelete }) {
    const [modalIsOpen, setModalIsOpen] = useState(open);
    const [successMessage, setSuccessMessage] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const { updateMaladies, path } = useUserData()
    const navigate = useNavigate();
    const [ok, setOk] = useState(false);


    const onDelete = () => {
        setModalIsOpen(false);
    }
    const handleDelete = async () => {
        setOk(true)
        try {
            const token = localStorage.getItem('token');
            axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
            const response = await axios.delete(
                `${path}/api/maladie/delete/${maladieToDelete._id}`
            );

            if (response.status === 200) {

                fetchMaladies(path, updateMaladies)
                setSuccessMessage("maladie deleted successfully!");
                setErrorMessage("");
                onDelete();
            }
        } catch (error) {
            console.error("Error deleting rendez-vous", error);
            setErrorMessage("Error deleting rendez-vous. Please try again.");
            setSuccessMessage("");
            navigate('/login');
        }
    };

    const handleCloseModal = () => {
        setModalIsOpen(false);
    }

    return (
        <Modal show={modalIsOpen} onHide={handleCloseModal}>
        {ok&&<Loading/>}
        {!ok&&<>
            <Modal.Header closeButton>
                <Modal.Title>Deletion Confirmation</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <p>Are you sure to remove this disease and all its tree structure?</p>
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

export default Form_delete_maladie;
