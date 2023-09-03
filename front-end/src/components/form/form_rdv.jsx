
import React, { useEffect, useState } from "react";
import { Modal, Button } from 'react-bootstrap';
import axios from "axios"; // Import Axios
import "./form.css";
import { Link, Navigate } from "react-router-dom";
import { useUserData } from "../../contexts/UserDataContext";
import { fetchMedecinRdvs, fetchPatientRdvs, fetchRdvs } from "../fetchElement/fetchRdvs";
import { Week, Month, TimelineViews, TimelineMonth, Agenda, ScheduleComponent, ResourcesDirective, ResourceDirective, ViewsDirective, ViewDirective, Inject } from '@syncfusion/ej2-react-schedule';
import '@syncfusion/ej2-base/styles/material.css';
import '@syncfusion/ej2-react-buttons/styles/material.css';
import '@syncfusion/ej2-react-calendars/styles/material.css';
import '@syncfusion/ej2-react-dropdowns/styles/material.css';
import '@syncfusion/ej2-react-inputs/styles/material.css';
import '@syncfusion/ej2-react-popups/styles/material.css';
import '@syncfusion/ej2-react-schedule/styles/material.css';

function Form_rdv({ open,doctor,rdvs, rdvToUpdate }) {
    const [modalIsOpen, setModalIsOpen] = useState(open);
    const [dateDebutRdv, setDateDebutRdv] = useState();
    const [patient_id, setPatient_id] = useState();
    const [dateFinRdv, setDateFinRdv] = useState();
    const [successMessage, setSuccessMessage] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const { updateRdvs, patients, patient, medecins, userData } = useUserData();
    const [bouton, setBouton] = useState("save");
    const [doctor_id, setDoctor_id] = useState();
    



    useEffect(() => {
        if (rdvToUpdate) {
            setBouton("update")
            console.log(rdvToUpdate._id)
            setDateDebutRdv(rdvToUpdate.dateDebutRdv | "");
            setDateFinRdv(rdvToUpdate.dateFinRdv | "");
        }
    }, [rdvToUpdate]);

    ////////////////////// soumission formulaire ////////////////////
    
        const handleSubmit = async (e) => {
            e.preventDefault();

            if(!dateDebutRdv){
                setErrorMessage("Choose valid appointment date")
                return;
            }
            try {
                if (rdvToUpdate) { 
                    try {
                        const response = await axios.put(
                            `http://192.168.11.104:5000/api/rendez_vous/update/${rdvToUpdate._id}`,
                            {
                                dateDebutRdv,
                                dateFinRdv,

                            }
                        );

                        if (response.status === 200) {
                            const rdv = response.data;
                            if (userData.role.includes('patient') && !userData.role.includes('admin')) { 
                                fetchPatientRdvs(userData._id, updateRdvs)
                            }
                            else if (userData.role.includes('medecin') && !userData.role.includes('admin')) {
                                fetchMedecinRdvs(userData._id, updateRdvs)
                            }
                            else {
                                fetchRdvs(updateRdvs)
                            }
                            console.log("update rdv done :", rdv);
                            setSuccessMessage("Updated successful!");
                            setErrorMessage("");
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
                            `http://192.168.11.104:5000/api/rendez_vous/${patient_id}/${doctor_id}`,
                            {
                                dateDebutRdv,
                                dateFinRdv,
                            }
                        );

                        if (response.status === 200) {
                            const rdv = response.data;
                            if (userData.role.includes('patient') && !userData.role.includes('admin')) {
                                fetchPatientRdvs(userData._id, updateRdvs)
                            }
                            else if (userData.role.includes('medecin') && !userData.role.includes('admin')) {
                                fetchMedecinRdvs(userData._id, updateRdvs)
                            }
                            else {
                                fetchRdvs(updateRdvs)
                            }
                            console.log("Nouveau rdv enregistré :", rdv);
                            setSuccessMessage("Registration successful!"); 
                            setErrorMessage("");
                            setModalIsOpen(false);
                        }
                    } catch (error) {
                        console.error("Erreur lors de l'enregistrement du rendez vous", error);
                        setErrorMessage(error.response.data.message);
                        setSuccessMessage("");

                    }
                }
            } catch (error) {

            } 
        };

    const handleInputChange = (e) => {
        const { name, value, type } = e.target;
        switch (name) {
            case "patient_id":
                setPatient_id(value);
                break;
            default:
                break;
        }
    };

    const closeModal = () => {
        setModalIsOpen(false);
    };

    const handleCellClick = (args) => {
        const _id = args.groupIndex
        const targetDoctor = doctor.find(doc => doc.Id === _id);
        setDoctor_id(targetDoctor._id)
        setDateDebutRdv(args.startTime)
        setDateFinRdv(args.endTime)
        console.log("#########", targetDoctor._id)
        console.log(args);
    };


    const handleCloseModal = () => {
        setModalIsOpen(false);
    }

 
    const eventSettings = { dataSource: rdvs }
    const group = { allowGroupEdit: true, resources: ['RendezVous'] }
    return (
        <Modal show={modalIsOpen} onHide={handleCloseModal} contentClassName="custom-modal-content" size="lg">
            <form onSubmit={handleSubmit}>
                <Modal.Header closeButton>
                    <Modal.Title>Appointment form</Modal.Title>
                </Modal.Header>
                <Modal.Body style={{ width: '100%' }}>
                    {successMessage && <p className="success-message" style={{textAlign:'center'}}>{successMessage}</p>}
                    {errorMessage && <p className="error-message" style={{textAlign:'center'}}>{errorMessage}</p>}
                    {!rdvToUpdate && <div className="form-field">
                        <label>Patient</label>
                        <select name="patient_id" value={patient_id} onChange={handleInputChange} style={{width:'200px', borderRadius:'10px'}} required>
                            <option value="">choose a patient</option>
                            {patients.map((patient) => (
                                <option key={patient._id} value={patient._id}>
                                    {patient.nom} {patient.prenom}
                                </option>
                            ))}
                        </select>
                    </div>}
                    <div className="form-field">
                        <ScheduleComponent
                            width='100%'
                            height='550px'
                            margin='auto'
                            selectedDate={new Date()}
                            currentView='TimelineWeek'
                            eventSettings={eventSettings}
                            group={group}
                            cellClick={handleCellClick}>
                            <ViewsDirective>
                                <ViewDirective option='Week' />
                                <ViewDirective option='Month' />
                                <ViewDirective option='TimelineWeek' />
                                <ViewDirective option='TimelineMonth' />
                                <ViewDirective option='Agenda' />
                            </ViewsDirective>
                            <ResourcesDirective>
                                <ResourceDirective 
                                field='DoctorId' 
                                title='Rendez-vous' 
                                name='RendezVous' 
                                allowMultiple={true} 
                                dataSource={doctor} 
                                textField='Text' 
                                idField='Id' 
                                colorField='Color'
                                workDaysField='IsWorkDay'
                                >
                                </ResourceDirective>
                            </ResourcesDirective>
                            <Inject services={[Week, Month, TimelineViews, TimelineMonth, Agenda]} />
                        </ScheduleComponent>

                    </div>
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

export default Form_rdv;
