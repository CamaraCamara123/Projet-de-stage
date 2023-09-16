import React, { useEffect, useState } from 'react';
import {
  MDBCol,
  MDBContainer,
  MDBRow,
  MDBCard,
  MDBCardText,
  MDBCardBody,
  MDBCardImage,
  MDBBtn,
  MDBCardHeader
} from 'mdb-react-ui-kit';
import { Table } from 'react-bootstrap';
import 'mdb-react-ui-kit/dist/css/mdb.min.css';
import { useUserData } from '../../contexts/UserDataContext';
import Transition from '../../constants/transition';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClipboardUser } from '@fortawesome/free-solid-svg-icons';
import { fetchDiagnostic } from '../../components/fetchElement/fetchDiagnostic';
import Form_detail_diagnostic from '../../components/form/form_chart_diagnostic';

export default function DossierMedical() {
  const { patient, consultations } = useUserData();
  const { path, diagnostic, updateDiagnostic,  } = useUserData();
  const [details, setDetails] = useState([]);
  const [typeGraph, setTypeGraph] = useState("column");
  const [modalIsOpen, setModalIsOpen] = useState(false)

  const fdetails = (diagnostic_id) => {
    setTypeGraph("column")
    fetchDiagnostic(path,diagnostic_id, updateDiagnostic);
    const tabDetails = [];
    if (diagnostic && diagnostic._id == diagnostic_id) {
        for (let i = 0; i < diagnostic.maladies.length; i++) {
            const newDetail = { label: diagnostic.maladies[i].nom, y: parseFloat(diagnostic.probabilities[i]) }
            tabDetails.push(newDetail)
            console.log(diagnostic.probabilities[i])
            if (diagnostic.probabilities[i] == 100.0) {
                console.log("Un 100%")
                setTypeGraph("stackedColumn100")
            }
        }
        setDetails(tabDetails)
        modalIsOpen ? setModalIsOpen(false) : setModalIsOpen(true);
    }
}


  return (
    <Transition>
      <section style={{ backgroundColor: '#eee' }}>
        <MDBContainer className="py-5">
          <MDBRow>
            <MDBCol lg="4">
              <MDBCard className="mb-4">
                <MDBCardBody className="text-center">
                  <MDBCardImage
                    src={`${path}/uploads/${patient.photo}`}
                    alt={patient.photoName}
                    className="rounded-circle"
                    style={{ width: '120px' }}
                    fluid />
                  <p className="text-muted mb-1">{patient.role[0]}</p>
                  <p className="text-muted mb-4">{patient.nom} {patient.prenom}</p>
                  <div className="d-flex justify-content-center mb-2">
                    <MDBBtn>Profil</MDBBtn>
                    <MDBBtn outline className="ms-1">Message</MDBBtn>
                  </div>
                </MDBCardBody>
              </MDBCard>
            </MDBCol>
            <MDBCol lg="8">
              <MDBCard className="mb-4">
                <MDBCardBody>
                  <MDBRow>
                    <MDBCol sm="3">
                      <MDBCardText>First name</MDBCardText>
                    </MDBCol>
                    <MDBCol sm="9">
                      <MDBCardText className="text-muted">{patient.nom}</MDBCardText>
                    </MDBCol>
                  </MDBRow>
                  <hr />
                  <MDBRow>
                    <MDBCol sm="3">
                      <MDBCardText>Last name</MDBCardText>
                    </MDBCol>
                    <MDBCol sm="9">
                      <MDBCardText className="text-muted">{patient.prenom}</MDBCardText>
                    </MDBCol>
                  </MDBRow>
                  <hr />
                  <MDBRow>
                    <MDBCol sm="3">
                      <MDBCardText>Email</MDBCardText>
                    </MDBCol>
                    <MDBCol sm="9">
                      <MDBCardText className="text-muted">{patient.username}</MDBCardText>
                    </MDBCol>
                  </MDBRow>
                  <hr />
                  <MDBRow>
                    <MDBCol sm="3">
                      <MDBCardText>Tel</MDBCardText>
                    </MDBCol>
                    <MDBCol sm="9">
                      <MDBCardText className="text-muted">{patient.tel}</MDBCardText>
                    </MDBCol>
                  </MDBRow>
                  <hr />
                  <MDBRow>
                    <MDBCol sm="3">
                      <MDBCardText>Address</MDBCardText>
                    </MDBCol>
                    <MDBCol sm="9">
                      <MDBCardText className="text-muted">{patient.adresse}</MDBCardText>
                    </MDBCol>
                  </MDBRow>
                </MDBCardBody>
              </MDBCard>
            </MDBCol>
          </MDBRow>
          <MDBRow>
            <MDBCol>
              <MDBRow>
                <MDBCol lg="12">
                  <MDBCard className="mb-4">
                    <MDBCardHeader><span className="text-primary font-italic me-1">Patient</span> Visits Details</MDBCardHeader>
                    <MDBCardBody>
                      <Table striped bordered hover responsive className=''>
                        <thead className='tabHead'>
                          <tr>
                            <th>Date</th>
                            <th>Doctor</th>
                            <th>Diseases</th>
                            <th>Certainty</th>
                            <th>Image</th>
                            <th>Symptoms</th>
                            <th>Detail</th>
                          </tr>
                        </thead>
                        {consultations.map((consult, index) => (
                          <tbody key={index}>
                            {consult.diagnostics.map((diagnostic, diagnosticIndex) => (
                              <tr key={diagnosticIndex}>
                                <td className='case'>{new Date(diagnostic.consultation.dateConsult).toISOString().split('T')[0]}</td>
                                <td className='case'>{consult.rdv.medecin.nom} {consult.rdv.medecin.prenom}</td>
                                <td className='case'>
                                  <strong>{diagnostic.maladie.nom}</strong>
                                </td>
                                <td className='case'>
                                  <strong>{diagnostic.probability} %</strong>
                                </td>
                                <td>
                                  <MDBCardImage
                                    src={`${path}/uploads/${diagnostic.imagePath}`}
                                    alt={diagnostic.imageName}
                                    style={{ width: '60px', borderRadius:'10%' }}
                                    />
                                </td>
                                <td className='case'>
                                  <ul style={{ margin: '0', padding: '0', listStyleType: 'none' }}>
                                    {diagnostic.descripSymptome.map((symptom, index3) => (
                                      <li key={index3}>
                                        <strong>{symptom}</strong>
                                      </li>
                                    ))}
                                  </ul>
                                </td>
                                <td>
                                  <button className='elt-btn btn btn-dark' title='diagnostics' onClick={() => fdetails(diagnostic._id)}>
                                    <FontAwesomeIcon icon={faClipboardUser} />
                                  </button>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        ))}
                      </Table>
                    </MDBCardBody>
                  </MDBCard>
                </MDBCol>
              </MDBRow>
            </MDBCol>
          </MDBRow>
        </MDBContainer>
      </section>
      {modalIsOpen&&<Form_detail_diagnostic open={modalIsOpen} details={details} type={typeGraph} diagnostic={diagnostic} />}
    </Transition>
  );
}