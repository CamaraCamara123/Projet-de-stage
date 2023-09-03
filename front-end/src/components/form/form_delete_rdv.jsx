import React, { useState } from "react";
import { Modal, Button } from 'react-bootstrap';
import axios from "axios"; // Import Axios
import "./form.css";
import { Link, Navigate } from "react-router-dom";
import { fetchMedecinRdvs, fetchPatientRdvs, fetchRdvs } from "../fetchElement/fetchRdvs";
import { useUserData } from "../../contexts/UserDataContext";

function Form__delete_rdv({ open, rdvToDelete }) {
  const [modalIsOpen, setModalIsOpen] = useState(open);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const {updateRdvs,medecin,patient} = useUserData()


  const closeModal = () => {
    setModalIsOpen(false);
  };

  const onDelete = () => {
    setModalIsOpen(false);
    return <Navigate to='/dashboard' />
  }
  const handleDelete = async () => {
      try {
        const response = await axios.delete(
          `http://192.168.11.104:5000/api/rendez_vous/${rdvToDelete._id}`
        );

        if (response.status === 200) {
          if(patient){
            fetchPatientRdvs(updateRdvs)
          }
          else if(medecin){
            fetchMedecinRdvs(updateRdvs)
          }
          else{
            fetchRdvs(updateRdvs)
          }
          setSuccessMessage("rendez-vous deleted successfully!");
          setErrorMessage("");
          onDelete();
        }
      } catch (error) {
        console.error("Error deleting rendez-vous", error);
        setErrorMessage("Error deleting rendez-vous. Please try again.");
        setSuccessMessage("");
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
        <p>Are you sure to delete this appointment?</p>
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

export default Form__delete_rdv;
