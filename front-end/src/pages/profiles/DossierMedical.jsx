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
  MDBBreadcrumb,
  MDBBreadcrumbrdv,
  MDBProgress,
  MDBProgressBar,
  MDBIcon,
  MDBListGroup,
  MDBListGrouprdv,
  MDBTableBody,
  MDBTable,
  MDBTableHead,
  MDBCardHeader
} from 'mdb-react-ui-kit';
import { Table } from 'react-bootstrap';
import 'mdb-react-ui-kit/dist/css/mdb.min.css';
import { useUserData } from '../../contexts/UserDataContext';
import Transition from '../../constants/transition';



export default function DossierMedical() {
  const { patient, rdvs } = useUserData();


  return (
    <Transition>
      <section style={{ backgroundColor: '#eee' }}>
        <MDBContainer className="py-5">
          <MDBRow>
            <MDBCol lg="4">
              <MDBCard className="mb-4">
                <MDBCardBody className="text-center">
                  <MDBCardImage
                    src={patient.photo}
                    alt={patient.photoName}
                    className="rounded-circle"
                    style={{ width: '150px' }}
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
                    <MDBCardHeader><span className="text-primary font-italic me-1">Patient</span> Appointments Details</MDBCardHeader>
                    <MDBCardBody>
                      <Table striped bordered hover responsive>
                        <thead>
                          <tr>
                            <th>Date</th>
                            <th>Doctor</th>
                            <th>Diseases</th>
                            <th>certainty</th>
                            <th>Symptoms</th>
                            <th>REQUIREMENT</th>
                          </tr>
                        </thead>
                        {rdvs.map((rdv, index) => (
                          <tbody key={index}>
                            {rdv.consultations.map((consultation, consultationIndex) => (
                              <tr key={consultationIndex}>
                                <td>{new Date(rdv.dateDebutRdv).toISOString().split('T')[0]}</td>
                                <td style={{ padding: '0.5rem', width: '150px' }}>{rdv.medecin.nom} {rdv.medecin.prenom}</td>
                                <td style={{ padding: '0.5rem' }}>
                                  <strong>{consultation.maladie.nom}</strong>
                                </td>
                                <td style={{ padding: '0.5rem' }}>
                                  <strong>{consultation.probability} %</strong>
                                </td>
                                <td style={{ padding: '0.5rem' }}>
                                  <ul style={{ margin: '0', padding: '0', listStyleType: 'none' }}>
                                    {consultation.descripSymptome.map((symptom, index3) => (
                                      <li key={index3}>
                                        <strong>{symptom}</strong>
                                      </li>
                                    ))}
                                  </ul>
                                </td>
                                <td style={{ padding: '0.5rem' }}>
                                  <ul style={{ margin: '0', padding: '0', listStyleType: 'none' }}>
                                    {consultation.prescription.map((presc, consultIndex) => (
                                      <li key={consultIndex}>
                                        <strong>{presc}</strong>
                                      </li>
                                    ))}
                                  </ul>
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
          <MDBRow className='mt-4'>
            <MDBCol md="6">
              <MDBCard className="mb-4 mb-md-0" style={{ overflow: 'scroll', maxHeight: '400px' }}>
                <MDBCardHeader><span className="text-primary font-italic me-1">Diagnosed diseases</span> List</MDBCardHeader>
                <MDBCardBody>
                  {rdvs &&
                    rdvs.map((rdv, index1) => (
                      <div key={index1}>
                        {rdv.consultations.map((consult, consultationIndex) => (
                          <div key={consultationIndex}>
                            {console.log("maladie : ", consult.maladie.nom)}
                            <MDBCardText className="mb-1" style={{ fontSize: '.77rem' }}>{consult.maladie?.nom}</MDBCardText>
                            <MDBProgress className="rounded">
                              <MDBProgressBar width={parseInt(consult.probability)} valuemin={0} valuemax={100} />
                            </MDBProgress>
                          </div>
                        ))}
                      </div>
                    ))
                  }

                </MDBCardBody>
              </MDBCard>
            </MDBCol>
            <MDBCol md="6">
              <MDBCard className="mb-4 mb-md-0">
                <MDBCardHeader><span className="text-primary font-italic me-1">IMAGE</span> FOR EACH DISEASE Diagnosed</MDBCardHeader>
                <MDBCardBody style={{ maxHeight: '400px', overflow: 'scroll' }}>
                  <MDBCardText className="mb-4"></MDBCardText>
                  {rdvs &&
                    rdvs.map((rdv, index1) => (
                      <div key={index1}>
                        {rdv.consultations.map((consult, consultationIndex) => (
                          <div key={consultationIndex} className='container' style={{ display: 'flex', justifyContent: 'center', textAlign: 'center', marginBottom: '2px' }}>
                            <h4>{consult.maladie?.nom}</h4>
                            <img src={consult.imageName} alt='consult_image' style={{width:'100%', height:'200px'}}/>
                          </div>
                        ))}
                      </div>
                    ))
                  }
                </MDBCardBody>
              </MDBCard>
            </MDBCol>
          </MDBRow>
        </MDBContainer>
      </section>
    </Transition>
  );
}