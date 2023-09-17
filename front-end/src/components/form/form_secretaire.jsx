import React, { useEffect, useState } from "react";
import { Modal, Button } from 'react-bootstrap';
import axios from "axios";
import "./form.css";
import { Link, Navigate } from "react-router-dom";
import { useUserData } from "../../contexts/UserDataContext";
import fetchSecretaires from "../fetchElement/fetchSecretaires";

function Form_Secretaire({ open, secretaireToUpdate }) {
    const [modalIsOpen, setModalIsOpen] = useState(open);
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [adresse, setAdresse] = useState("");
    const [nom, setNom] = useState("");
    const [prenom, setPrenom] = useState("");
    const [tel, setTel] = useState("");
    const [codeEmp, setCodeEmp] = useState("");
    const [photo, setPhoto] = useState("");
    const [genre, setGenre] = useState("");
    const [successMessage, setSuccessMessage] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const { updateSecretaires, path } = useUserData()
    const [msgError, setMsgError] = useState("")
    const [bouton, setBouton] = useState("save")


    useEffect(() => {
        if (secretaireToUpdate) {
            setBouton("update")
            setUsername(secretaireToUpdate.username || "");
            setAdresse(secretaireToUpdate.adresse || "");
            setNom(secretaireToUpdate.nom || "");
            setPrenom(secretaireToUpdate.prenom || "");
            setTel(secretaireToUpdate.tel || "");
            setCodeEmp(secretaireToUpdate.codeEmp || "");
            setGenre(secretaireToUpdate.genre || "");
        }
    }, [secretaireToUpdate]);

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
            if (secretaireToUpdate) {
                const token = localStorage.getItem('token');
                axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

                try {
                    const response = await axios.put(
                        `${path}/api/users/secretaire/update/${secretaireToUpdate._id}`,
                        {
                            username,
                            nom,
                            prenom,
                            tel,
                            codeEmp,
                            genre,
                        }
                    );

                    if (response.status === 200) {
                        setSuccessMessage("Updated successful!");
                        setErrorMessage("");
                        fetchSecretaires(path, updateSecretaires);
                        if (photo) {
                            handlePhoto(photo, username);
                        }
                        setModalIsOpen(false);
                    }
                } catch (error) {
                    console.error("Erreur lors de l'enregistrement du Secretaire", error);
                    setErrorMessage("Error during updating. Please try again.");
                    setSuccessMessage("");

                }

            } else {
                try {
                    const token = localStorage.getItem('token');
                    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
                    const response = await axios.post(
                        `${path}/api/users/secretaire/create`,
                        {
                            username,
                            password,
                            confirmPassword,
                            nom,
                            prenom,
                            tel,
                            codeEmp,
                            genre,
                        }
                    );

                    if (response.status === 201) {
                        setSuccessMessage("Registration successful!");
                        setErrorMessage("");
                        fetchSecretaires(path, updateSecretaires);
                        if (photo) {
                            handlePhoto(photo, username);
                        }
                        setModalIsOpen(false);
                    }
                } catch (error) {
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
            case "nom":
                setNom(value);
                break;
            case "prenom":
                setPrenom(value);
                break;
            case "codeEmp":
                setCodeEmp(value);
                break;
            case "tel":
                setTel(value);
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
                    <Modal.Title>Secretory form</Modal.Title>
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
                    {/* <div className="form-field">
            <label>Adresse</label>
            <input
              type="text"
              name="adresse"
              value={adresse}
              onChange={handleInputChange}
              required
            />
          </div> */}
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

                    {!secretaireToUpdate && <>
                        <div className="form-field">
                            <label>PASSWORD</label>
                            <input
                                type="text"
                                name="password"
                                value={password}
                                onChange={handleInputChange}
                                required
                            />
                        </div>
                        <div className="form-field">
                            <label>CONFIRMATION</label>
                            <input
                                type="text"
                                name="confirmPassword"
                                value={confirmPassword}
                                onChange={handleInputChange}
                                required
                            />
                        </div>
                        {!isPasswordValid() && <p className="error-message">{msgError}</p>}
                    </>}
                    <div className="form-field">
                        <label>PHONE</label>
                        <input
                            type="tel"
                            name="tel"
                            value={tel}
                            onChange={handleInputChange}
                            required
                        />
                    </div>
                    <div className="form-field">
                        <label>IMAGE</label>
                        <input
                            type="file"
                            name="photo"
                            accept="image/*"
                            onChange={handleInputChange}
                        />
                    </div>
                    <div className="form-field">
                        <label>EMPLOYEE CODE</label>
                        <input
                            type="text"
                            name="codeEmp"
                            value={codeEmp}
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

export default Form_Secretaire;
