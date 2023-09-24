import React, { useState } from "react";
import { Modal, Button } from 'react-bootstrap';
import axios from "axios"; // Import Axios
import "./form.css";
import { Link, Navigate } from "react-router-dom";
import { useUserData } from "../../contexts/UserDataContext";
import { fetchConsultations, fetchPatientVisite } from "../fetchElement/fetchConsultations";
import { useNavigate } from 'react-router-dom';
import Loading from "../../constants/loading";


function Form__delete_consultation({ open, consultationToDelete }) {
  const [modalIsOpen, setModalIsOpen] = useState(open);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const { updateConsultations, path, patient } = useUserData()
  const navigate = useNavigate();
  const [ok, setOk] = useState(false);


  const onDelete = () => {
    setModalIsOpen(false);
    fetchPatientVisite(path, consultationToDelete.rdv.patient._id, updateConsultations)
  }
  const handleDelete = async () => {
    setOk(true);
    try {
      const token = localStorage.getItem('token');
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      const response = await axios.delete(
        `${path}/api/consultation/delete/${consultationToDelete._id}`
      );

      if (response.status === 200) {
        fetchPatientVisite(path, consultationToDelete.rdv.patient._id, updateConsultations)
        setSuccessMessage("consultation deleted successfully!");
        setErrorMessage("");
        onDelete();
      }
    } catch (error) {
      console.error("Error deleting consultation", error);
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
    {ok&&<Loading/>}
    {!ok&&<>
      <Modal.Header closeButton>
        <Modal.Title>Deletion Confirmation</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p>Are you sure to delete this consultation?</p>
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

export default Form__delete_consultation;
