import React, { useState } from "react";
import { Modal, Button } from 'react-bootstrap';
import axios from "axios"; // Import Axios
import "./form.css";
import { Link, Navigate } from "react-router-dom";
import fetchPatients from "../fetchElement/fetchPatients";
import { fetchMedecins } from "../fetchElement/fetchMedecins";
import fetchSecretaires from "../fetchElement/fetchSecretaires";
import { useUserData } from "../../contexts/UserDataContext";
import { useNavigate } from 'react-router-dom';

function Form_confirm_delete({ open, userToDelete }) {
  const [modalIsOpen, setModalIsOpen] = useState(open);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const { updatePatients, updateMedecins, updateSecretaires, path } = useUserData();
  const navigate = useNavigate();

  const onDelete = () => {
    setModalIsOpen(false);
  }
  const handleDelete = async () => {
    if (
      userToDelete.role.includes("patient") &&
      userToDelete.role.length === 1
    ) {

      try {
        const token = localStorage.getItem('token');
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        const response = await axios.delete(
          `${path}/api/users/patient/delete/${userToDelete._id}`
        );

        if (response.status === 200) {
          fetchPatients(path, updatePatients)
          setSuccessMessage("user deleted successfully!");
          setErrorMessage("");
          onDelete()

        }
      } catch (error) {
        console.error("Error deleting user", error);
        setErrorMessage(error.response.data.message);
        setSuccessMessage("");
        // navigate('/login')
      }
    } else if (
      userToDelete.role.includes("medecin") &&
      userToDelete.role.length === 1
    ) {
      try {
        const token = localStorage.getItem('token');
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        const response = await axios.delete(
          `${path}/api/users/dermatologue/delete/${userToDelete._id}`
        );

        if (response.status === 200) {
          fetchMedecins(path,updateMedecins);
          setSuccessMessage("Dermatologue deleted successfully!");
          setErrorMessage("");
          onDelete();
        }
      } catch (error) {
        console.error("Error deleting dermatologue", error);
        setErrorMessage(error.response.data.message);
        setSuccessMessage("");
        // navigate('/login')
      }
    } else if (
      userToDelete.role.includes("secretaire") &&
      userToDelete.role.length === 1
    ) {
      try {
        const token = localStorage.getItem('token');
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        const response = await axios.delete(
          `${path}/api/users/secretaire/delete/${userToDelete._id}`
        );

        if (response.status === 200) {
          fetchSecretaires(path, updateSecretaires)
          setSuccessMessage("Secretaire deleted successfully!");
          setErrorMessage("");
          onDelete();
        }
      } catch (error) {
        console.error("Error deleting secretaire", error);
        setErrorMessage(error.response.data.message);
        setSuccessMessage("");
        // navigate('/login')
      }
    }
  };

  const handleCloseModal = () => {
    setModalIsOpen(false);
  }

  return (
    <Modal show={modalIsOpen} onHide={handleCloseModal}>
      <Modal.Header closeButton>
        <Modal.Title>Deletion Confirmation</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p>Are you sure to delete this user?</p>
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
    </Modal>
  );
}

export default Form_confirm_delete;
