import React, { useEffect, useState, userData } from 'react';
import { Modal, Button } from 'react-bootstrap';
import { MDBCol, MDBContainer, MDBRow, MDBCard, MDBCardText, MDBCardBody, MDBCardImage, MDBTypography, MDBIcon } from 'mdb-react-ui-kit';
import './style.css'
import 'mdb-react-ui-kit/dist/css/mdb.min.css';
import { useUserData } from '../../contexts/UserDataContext';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import { Navigate } from 'react-router-dom';
import Transition from '../../constants/transition';

export default function Account() {

  const { patient, medecin, secretaire, userData } = useUserData();
  const [user, setUser] = useState();
  const [showModal, setShowModal] = useState(false);
  const [photo, setPhoto] = useState()
  const [docs, setDocs] = useState(false)

  // const handlerPhoto = async (user_id)=>{
  //   const token = localStorage.getItem('token');
  //     axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  //       try {
  //           const response = await axios.get(`http://192.168.11.104:5000/api/patients/${user_id}/image`, {
  //               headers: {
  //                   'Content-Type': 'application/json'
  //               }
  //           });
  //           setPhoto(response.data);
  //           console.log(response.data)
  //       } catch (error) {
  //           console.error('Erreur lors de la récupération de la photo :', error);
  //       }
  // }
  useEffect(() => {
    if (userData) {
      setUser(userData);
    }
  }, [userData]);

  const fdocsMedical = async () => {
    setDocs(true)
  }



  if (user) {
    return (
      <Transition>
        <MDBContainer className="py-5 h-100">
          <MDBRow className="flex justify-content-center align-items-center h-0">
            <MDBCol lg="12" className="mb-4 mb-lg-0">
              <MDBCard className="mb-3" style={{ borderRadius: '.5rem' }}>
                <MDBRow className="g-0">
                  <MDBCol md="4" className="gradient-custom text-center text-white"
                    style={{ borderTopLeftRadius: '.5rem', borderBottomLeftRadius: '.5rem' }}>
                    <MDBCardImage src={user.photo}
                      alt={user.photoName} className="my-5 cercle" style={{ width: '80px', borderRadius: "50%" }} fluid />
                    <MDBTypography tag="h5">{user.nom} {user.prenom}</MDBTypography>
                    <MDBCardText>{user.role[0]}</MDBCardText>
                    {/* {(patient || medecin) && <span>
                          <button className='btn btn-success mb-2' onClick={() => frdv(patient._id)}>
                            <FontAwesomeIcon icon={faEdit} />Mes rdv
                          </button>
                        </span>} */}
                    {(user.role.includes('patient') && !user.role.includes('admin')) && <span>
                      <button className='btn btn-primary' onClick={() => fdocsMedical(patient._id)}>
                        <FontAwesomeIcon icon={faEyeSlash} />Docs medical
                      </button>
                    </span>}
                  </MDBCol>
                  <MDBCol md="8">
                    <MDBCardBody className="p-4">
                      <MDBTypography tag="h6">Information</MDBTypography>
                      <hr className="mt-0 mb-4" />
                      <MDBRow className="pt-1">
                        <MDBCol size="6" className="mb-3">
                          <MDBTypography tag="h6">Email</MDBTypography>
                          <MDBCardText className="text-muted">{user.username}</MDBCardText>
                        </MDBCol>
                        <MDBCol size="6" className="mb-3">
                          <MDBTypography tag="h6">Phone</MDBTypography>
                          <MDBCardText className="text-muted">{user.tel}</MDBCardText>
                        </MDBCol>
                      </MDBRow>

                      <MDBTypography tag="h6">Information</MDBTypography>
                      <hr className="mt-0 mb-4" />
                      <MDBRow className="pt-1">
                        <MDBCol size="6" className="mb-3">
                          <MDBTypography tag="h6">Email</MDBTypography>
                          <MDBCardText className="text-muted">{user.username}</MDBCardText>
                        </MDBCol>
                        <MDBCol size="6" className="mb-3">
                          <MDBTypography tag="h6">Phone</MDBTypography>
                          <MDBCardText className="text-muted">{user.tel}</MDBCardText>
                        </MDBCol>
                      </MDBRow>

                      <div className="d-flex justify-content-start">
                        <a href="#!"><MDBIcon fab icon="facebook me-3" size="lg" /></a>
                        <a href="#!"><MDBIcon fab icon="twitter me-3" size="lg" /></a>
                        <a href="#!"><MDBIcon fab icon="instagram me-3" size="lg" /></a>
                      </div>
                    </MDBCardBody>
                  </MDBCol>
                </MDBRow>
              </MDBCard>
            </MDBCol>
          </MDBRow>
          {docs && <Navigate to='/dashboard/dossiers' />}
        </MDBContainer>
      </Transition>
    );
  }
}
