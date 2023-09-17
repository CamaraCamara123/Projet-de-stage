
import React, { useEffect, useState } from "react";
import { Modal, Button, Container, Row, Col, Card } from 'react-bootstrap';
import axios from "axios"; // Import Axios
import "./form.css";
import { useUserData } from "../../contexts/UserDataContext";
import '@syncfusion/ej2-base/styles/material.css';
import '@syncfusion/ej2-react-buttons/styles/material.css';
import '@syncfusion/ej2-react-calendars/styles/material.css';
import '@syncfusion/ej2-react-dropdowns/styles/material.css';
import '@syncfusion/ej2-react-inputs/styles/material.css';
import '@syncfusion/ej2-react-popups/styles/material.css';
import '@syncfusion/ej2-react-schedule/styles/material.css';
import { fetchConsultationDiagnostic } from "../fetchElement/fetchDiagnostic";

function Form_valide_diagnostic({ open, diagnostic }) {
    const [modalIsOpen, setModalIsOpen] = useState(open);
    const [maladie_id, setMaladie_id] = useState();
    const [successMessage, setSuccessMessage] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const { updateDiagnostics, path } = useUserData();
    const [bouton, setBouton] = useState("Confirm");


    ////////////////////// soumission formulaire ////////////////////

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const token = localStorage.getItem('token');
            axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
            const response = await axios.put(
                `${path}/api/diagnostic/validation/${diagnostic._id}/${maladie_id}`,
                {

                }
            );

            if (response.status === 200) {
                console.log("Diagnostic validated successfully :");
                fetchConsultationDiagnostic(path, diagnostic.consultation._id, updateDiagnostics);
                setSuccessMessage("wait please ......");
                setErrorMessage("");
                setModalIsOpen(false);
            }
        } catch (error) {
            console.error("An error happened", error);
            setErrorMessage("Error during updating. Please try again.");
            setSuccessMessage("");

        }

    };

    const handleInputChange = (e) => {
        const { name, value, type } = e.target;
        switch (name) {
            case "maladie_id":
                setMaladie_id(value);
                break;
            default:
                break;
        }
    };

    const handleCloseModal = () => {
        setModalIsOpen(false);
    }

    return (
        <Modal show={modalIsOpen} onHide={handleCloseModal} contentClassName="custom-modal-content" size="md">
            <form onSubmit={handleSubmit}>
                <Modal.Header closeButton>
                    <Modal.Title>DIAGNOSTIC VALIDATION</Modal.Title>
                </Modal.Header>
                <Modal.Body style={{ width: '100%' }}>
                    {successMessage && <p className="success-message">{successMessage}</p>}
                    {errorMessage && <p className="error-message">{errorMessage}</p>}
                    <Container className='chat-container' style={{ alignContent: "stretch" }}>
                        <Row>
                            <Col>
                                <div className="form-field">
                                    <label>SELECT THE CORRECT DISEASE</label>
                                    <select name="maladie_id" value={maladie_id} onChange={handleInputChange}
                                        style={{ width: "200px", justifyContent: 'initial', fontSize: '20px', color: 'gray' }} required>
                                        <option value="">choose</option>
                                        {diagnostic.maladies.map((maladie, index) => (
                                            <option key={maladie._id} value={maladie._id}>
                                                <span>{maladie.nom}</span> ========= <span>{diagnostic.probabilities[index]}%</span>
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </Col>
                        </Row>
                        <Row>
                            <Col>
                                <Card>
                                    <Card.Header>DISEASE DETECTED BY THE ALGORTHM</Card.Header>
                                    <Card.Body>
                                        <span>PREDICATED DISEASE : </span>{diagnostic.maladie.nom} <br />
                                        CONFIDENCE :{diagnostic.probability}% == {(diagnostic.probability >= 70) ? "High" : "LOW"}
                                    </Card.Body>
                                </Card>
                            </Col>
                        </Row>

                    </Container>
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

export default Form_valide_diagnostic;
