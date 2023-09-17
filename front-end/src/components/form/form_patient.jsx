import React, { useEffect, useState } from "react";
import { Modal, Button } from 'react-bootstrap';
import axios from "axios"; // Import Axios
import "./form.css";
import { Link, Navigate } from "react-router-dom";
import { useUserData } from "../../contexts/UserDataContext";
import fetchPatients from "../fetchElement/fetchPatients";


function Form({ open, patientToUpdate }) {
  const [modalIsOpen, setModalIsOpen] = useState(open);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [adresse, setAdresse] = useState("");
  const [nom, setNom] = useState("");
  const [prenom, setPrenom] = useState("");
  const [tel, setTel] = useState("");
  const [birthdate, setBirthdate] = useState("");
  const [photo, setPhoto] = useState("");
  const [genre, setGenre] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const { updatePatients, path } = useUserData()
  const [msgError, setMsgError] = useState("")
  const [bouton, setBouton] = useState("save")



  useEffect(() => {
    if (patientToUpdate) {
      setBouton("update")
      setUsername(patientToUpdate.username || "");
      setAdresse(patientToUpdate.adresse || "");
      setNom(patientToUpdate.nom || "");
      setPrenom(patientToUpdate.prenom || "");
      setTel(patientToUpdate.tel || "");
      setBirthdate(patientToUpdate.birthdate ? new Date(patientToUpdate.birthdate).toISOString().split('T')[0] : "");
      setGenre(patientToUpdate.genre || "");
    }
  }, [patientToUpdate]);

  ///////// verification mot de passe
  const isPasswordValid = () => {
    return password === confirmPassword;
  };

  /////// upload image profile
  const handlePhoto = async (photo, username) => {
    try {
      const formData = new FormData();
      formData.append("image", photo);
      const token = localStorage.getItem('token');
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      const response2 = await axios.put(
        `${path}/api/users/user/upload-image/${username}`,
        formData
      );

      if (response2.status === 200) {
        fetchPatients(path, updatePatients)
        setSuccessMessage("Image Registration successful!");
        setErrorMessage("");
      }
    } catch (error) {
      console.error("Erreur lors de l'enregistrement de l'image", error);
      setErrorMessage("Error during registration Image. Please try again.");
      setSuccessMessage("");
    }
  };

  ////////////////////// soumission formulaire ////////////////////
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (!isPasswordValid()) {
        setMsgError("le mot de passe et la confirmation ne correspondent pas");
        return;
      }
      if (patientToUpdate) {
        console.log(birthdate)
        try {
          const token = localStorage.getItem('token');
          axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
          const response = await axios.put(
            `${path}/api/users/patient/update/${patientToUpdate._id}`,
            {
              username,
              adresse,
              nom,
              prenom,
              tel,
              birthdate,
              genre,
            }
          );

          if (response.status === 200) {
            fetchPatients(path, updatePatients)
            setSuccessMessage("Updated successful!");
            setErrorMessage("");
            if (photo) {
              handlePhoto(photo, username);
            }
            setModalIsOpen(false);
          }
        } catch (error) {
          console.error("Erreur lors de l'enregistrement du client", error);
          setErrorMessage(error.response.data.message);
          setSuccessMessage("");

        }

      } else {
        try {
          const token = localStorage.getItem('token');
          axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
          const response = await axios.post(
            `${path}/api/users/patient/create`,
            {
              username,
              password,
              confirmPassword,
              adresse,
              nom,
              prenom,
              tel,
              birthdate,
              genre,
            }
          );

          if (response.status === 201) {
            const patient = response.data;
            fetchPatients(path, updatePatients);
            console.log("Nouveau patient enregistré :", patient);
            setSuccessMessage("Registration successful!");
            setErrorMessage("");
            if (photo) {
              handlePhoto(photo, username);
            }
            setModalIsOpen(false);
          }
        } catch (error) {
          console.error("Erreur lors de l'enregistrement du client", error);
          setErrorMessage(error.response.data.message);
          setSuccessMessage("");

        }
      }
    } catch (error) {

    }
  };


  const handleInputChange = (e) => {
    const { name, value, type, files } = e.target;

    switch (name) {
      case "username":
        setUsername(value);
        break;
      case "password":
        setPassword(value);
        break;
      case "confirmPassword":
        setConfirmPassword(value);
        break;
      case "adresse":
        setAdresse(value);
        break;
      case "nom":
        setNom(value);
        break;
      case "prenom":
        setPrenom(value);
        break;
      case "tel":
        setTel(value);
        break;
      case "birthdate":
        setBirthdate(value);
        break;
      case "photo":
        if (type === "file" && files && files.length > 0) {
          setPhoto(files[0]);
        }
        break;
      case "genre":
        setGenre(value);
        break;
      default:
        break;
    }
  };


  const handleCloseModal = () => {
    setModalIsOpen(false);
  }

  return (
    <Modal show={modalIsOpen} onHide={handleCloseModal}>
      <form onSubmit={handleSubmit}>
        <Modal.Header closeButton>
          <Modal.Title>Patient form</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {successMessage && <p className="success-message">{successMessage}</p>}
          {errorMessage && <p className="error-message">{errorMessage}</p>}
          <div className="form-field">
            <label>FIRST NAME</label>
            <input
              type="text"
              name="nom"
              value={nom}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="form-field">
            <label>LAST NAME</label>
            <input
              type="text"
              name="prenom"
              value={prenom}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="form-field">
            <label>GENDER</label>
            <select name="genre" value={genre} onChange={handleInputChange}>
              <option value="">Select</option>
              <option value="male">MALE</option>
              <option value="female">FEMALE</option>
            </select>
          </div>
          <div className="form-field">
            <label>ADDRESS</label>
            <input
              type="text"
              name="adresse"
              value={adresse}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="form-field">
            <label>USERNAME</label>
            <input
              type="text"
              name="username"
              value={username}
              onChange={handleInputChange}
              required
            />
          </div>

          {!patientToUpdate && <>
            <div className="form-field">
              <label for='password'>PASSWORD</label>
              <input
                type="text"
                name="password"
                id="password"
                value={password}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="form-field">
              <label for='confirmation'>CONFIRMATION</label>
              <input
                type="text"
                name="confirmPassword"
                id="confirmation"
                value={confirmPassword}
                onChange={handleInputChange}
                required
              /><br />
              {!isPasswordValid() && <p className="error-message">{msgError}</p>}
            </div>
          </>}
          <div className="form-field">
            <label for='phone'>PHONE</label>
            <input
              type="tel"
              name="tel"
              id="phone"
              value={tel}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="form-field">
            <label for='image'>IMAGE</label>
            <input
              type="file"
              name="photo"
              accept="image/*"
              id="image"
              onChange={handleInputChange}
            />
          </div>
          <div className="form-field">
            <label>BIRTHDATE</label>
            <input
              type="date"
              name="birthdate"
              value={birthdate || (patientToUpdate && patientToUpdate.birthdate) || ''}
              onChange={handleInputChange}
              required
            />
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

export default Form;
