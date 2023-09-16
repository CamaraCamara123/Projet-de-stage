import React, { createContext, useContext, useState } from 'react';

// Créez un contexte UserDataContext
const UserDataContext = createContext();

// Créez un Hook personnalisé pour utiliser le contexte UserDataContext
export function useUserData() {
  return useContext(UserDataContext);
}

// Composant Provider pour envelopper l'application et fournir les données utilisateur
export function UserDataProvider({ children }) {

  
  const [modalIsOpen, setModalIsOpen] = useState(false);

  const [userData, setUserData] = useState(null);
  const [userIdData, setUserIdData] = useState();

  const [patients, setPatients] = useState([]);
  const [patient, setPatient] = useState();

  const [medecins, setMedecins] = useState([]);
  const [medecin, setMedecin] = useState(null);

  const [details, setDetails] = useState([]);
  const [secretaire, setSecretaire] = useState(null);

  const [maladies, setMaladies] = useState([]);
  const [maladie, setMaladie] = useState(null);

  const [stades, setStades] = useState([]);
  const [stade, setStade] = useState(null);

  const [images, setImages] = useState([]);
  const [image, setImage] = useState(null);

  const [consultations, setConsultations] = useState([]);
  const [consultation, setConsultation] = useState(null);

  const [rdvs, setRdvs] = useState([]);
  const [rdv, setRdv] = useState(null);

  const [diagnostics, setDiagnostics] = useState([])
  const [diagnostic, setDiagnostic] = useState(null)
  const [path, setPath] = useState("http://192.168.11.104:5000")

  const openModal = () => {
    setModalIsOpen(true);
  };
  const closeModal = () => {
    setModalIsOpen(false);
  };


  const updateUserData = (data) => {
    setUserData(data);
  };
  const updateUserIdData = (data) => {
    setUserIdData(data)
  }

  const updatePatients = (data) => {
    setPatients(data)
  }
  const updatePatient = (data) => {
    setPatient(data)
  }

  const updateMedecins = (data) => {
    setMedecins(data)
  }
  const updateMedecin = (data) => {
    setMedecin(data)
  }

  const updateDetails = (data) => {
    setDetails(data)
  }
  const updateSecretaire = (data) => {
    setSecretaire(data)
  }

  const updateMaladies = (data) => {
    setMaladies(data)
  }
  const updateMaladie = (data) => {
    setMaladie(data)
  }

  const updateStades = (data) => {
    setStades(data)
  }
  const updateStade = (data) => {
    setStade(data)
  }

  const updateImages = (data) => {
    setImages(data)
  }
  const updateImage = (data) => {
    setImage(data)
  }

  const updateConsultations = (data) => {
    setConsultations(data)
  }
  const updateConsultation = (data) => {
    setConsultation(data)
  }

  const updateRdvs = (data) => {
    setRdvs(data)
  }
  const updateRdv = (data) => {
    setRdv(data)
  }

  const updateDiagnostics = (data)=>{
    setDiagnostics(data)
  }
  const updateDiagnostic = (data)=>{
    setDiagnostic(data)
  }


  return (
    <UserDataContext.Provider
      value={{
        userData, updateUserData,
        userIdData, updateUserIdData,
        patients, updatePatients,
        patient, updatePatient,
        medecins, updateMedecins,
        medecin, updateMedecin,
        details, updateDetails,
        secretaire, updateSecretaire,
        maladies, updateMaladies,
        maladie, updateMaladie,
        stades, updateStades,
        stade, updateStade,
        images, updateImages,
        image, updateImage,
        rdvs, updateRdvs,
        rdv, updateRdv,
        modalIsOpen,closeModal,openModal,
        consultations,updateConsultations,
        consultation, updateConsultation,
        diagnostics,updateDiagnostics,
        diagnostic,updateDiagnostic,
        path
      }}>
      {children}
    </UserDataContext.Provider>
  );
}
