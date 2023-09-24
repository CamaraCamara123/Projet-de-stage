import axios from 'axios';
import React, { useState } from 'react';
import { Modal, Button } from 'react-bootstrap';
import { fetchMaladies } from '../fetchElement/fetchMaladies';
import { useUserData } from '../../contexts/UserDataContext';
import { useNavigate } from 'react-router-dom';
import "./form.css";
import { useEffect } from 'react';
import Loading from '../../constants/loading';

export default function Form_maladie({ open, maladieToUpdate }) {
  const [maladie, setMaladie] = useState('');
  const [nombreStades, setNombreStades] = useState(0);
  const [stades, setStades] = useState([]);
  const [modalIsOpen, setModalIsOpen] = useState(open);
  const [bouton, setBouton] = useState("save")
  const { updateMaladies, path } = useUserData()
  const [successMessage, setSuccessMessage] = useState("");
  const [ok, setOk] = useState(true)
  const [fullName, setFullName] = useState("")
  const navigate = useNavigate();



  useEffect(() => {
    if (maladieToUpdate) {
      setMaladie(maladieToUpdate.nom);
      setFullName(maladieToUpdate.fullName);
      // setStades()
      setBouton("Update")
    }
  }, [maladieToUpdate])

  const handleNombreStadesChange = (event) => {
    const count = parseInt(event.target.value);
    setNombreStades(count);

    // Initialize stades array with unique objects for each stade
    const newStades = Array.from({ length: count }, () => ({ fullName: '', nom: '', images: [], description: '' }));
    setStades(newStades);
  };

  const handleStadeChange = (index, field, value) => {
    const newStades = [...stades];
    newStades[index][field] = value;
    setStades(newStades);
  };

  const handleImageUpload = (index, event) => {
    const newStades = [...stades];

    // Convertir la liste de fichiers en tableau
    const selectedImages = Array.from(event.target.files);

    // Ajouter chaque fichier d'image à la liste d'images du stade correspondant
    selectedImages.forEach(image => {
      newStades[index].images.push(image);
    });
    console.log("nombre images : ", newStades[index].images.length)
    setStades(newStades);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setOk(false)
    if (maladieToUpdate) {
      setSuccessMessage("Wait please, disease is updating ..........");
      await updateMaladie();
      await fetchMaladies(path, updateMaladies);
      setModalIsOpen(false)
    }
    else {
      setSuccessMessage("Wait please, disease is recording ..........")
      try {
        await createMaladie();
        await fetchMaladies(path, updateMaladies);
        setModalIsOpen(false)
      } catch (error) {
        console.log("Erreur lors de la soumission du formulaire :", error);
      }
    }
  };



  const createImage = async (stade_id, image) => {
    const formData = new FormData();
    formData.append("image", image);
    try {
      const token = localStorage.getItem('token');
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      const response2 = await axios.post(`${path}/api/stade/image/create/${stade_id}`,
        formData
      )
      if (response2.status === 200) {
        // console.log(response2.data)
        // console.log("enregistrement reussi !!!!!!!")
      }
    }
    catch (err) {
      console.log("Echec de l'enregistrement de l'image")
    }
  }

  const createStade = async (maladie_id, stade) => {
    try {
      const token = localStorage.getItem('token');
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      const response = await axios.post(`${path}/api/stade/create/${maladie_id}`, {
        stade: stade.nom,
        description: stade.description
      })
      if (response.status == 201) {
        console.log(response.data)
        for (let image of stade.images) {
          await createImage(response.data._id, image)
        }

        // Créer les images pour ce stade en parallèle
        // const imagePromises = stade.images.map(image => createImage(response1.data._id, image));
        // await Promise.all(imagePromises);
      }
    }
    catch (err) {
      console.log("Echec de l'enregistrement du stade")
    }
  }

  const createMaladie = async () => {
    try {
      const token = localStorage.getItem('token');
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      const response = await axios.post(`${path}/api/maladie/create`, {
        nom: maladie,
        fullName
      })
      if (response.status == 201) {
        // for (const stade of stades) {
        //   createStade(response.data._id, stade)
        // }
        const stadesPromises = stades.map(stade => createStade(response.data._id, stade));

        // Attendre que toutes les stades soient créées
        await Promise.all(stadesPromises);

        // Créer toutes les images en parallèle
        const imagesPromises = stades.flatMap(stade => stade.images.map(image => createImage(response.data._id, image)));

        // Attendre que toutes les images soient créées
        await Promise.all(imagesPromises);
      }
    }
    catch (err) {
      console.log("Echec de l'enregistrement de la maladie")
      navigate('/login')
    }
  }

  const updateMaladie = async () => {
    try {
      const token = localStorage.getItem('token');
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      const response = await axios.put(`${path}/api/maladie/update/${maladieToUpdate._id}`, {
        nom: maladie,
        fullName
      })
      if (response.status == 201) {
        const stadesPromises = stades.map(stade => createStade(response.data._id, stade));

        // Attendre que toutes les stades soient créées
        await Promise.all(stadesPromises);

        // Créer toutes les images en parallèle
        const imagesPromises = stades.flatMap(stade => stade.images.map(image => createImage(response.data._id, image)));

        // Attendre que toutes les images soient créées
        await Promise.all(imagesPromises);
      }
    }
    catch (err) {
      console.log("Echec de l'enregistrement de la maladie")
      navigate('/login')
    }
  }

  const handleCloseModal = () => {
    setModalIsOpen(false);
  }
  return (
    <Modal show={modalIsOpen} onHide={handleCloseModal} className={ok?'':'modal-container'}>
      {!ok&&<Loading/>}
      {ok&&<form onSubmit={handleSubmit}>
        <Modal.Header closeButton>
          <Modal.Title>DISEASE FORM</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {successMessage && <p className="success-message">{successMessage}</p>}
          <div className='form-group mb-2' style={{ display: 'flex', justifyContent: 'space-between' }}>
            <label>Disease FullName</label>
            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
            />
          </div>
          <div className='form-group mb-2' style={{ display: 'flex', justifyContent: 'space-between' }}>
            <label>Disease Name</label>
            <input
              type="text"
              value={maladie}
              onChange={(e) => setMaladie(e.target.value)}
            />
          </div>
          <div className='form-group mb-2' style={{ display: 'flex', justifyContent: 'space-between' }}>
            <label>{maladieToUpdate ? 'Add new Levels' : 'Number of Level'}</label>
            <input
              type="number"
              value={nombreStades}
              onChange={handleNombreStadesChange}
            />
          </div>
          {stades.map((stade, index) => (
            <div key={index} className='container'>
              <div className='form-group mb-2' style={{ display: 'flex', justifyContent: 'space-between' }}>
                <label>{`Level ${index + 1} `}</label>
                <input
                  type="text"
                  value={stade.nom}
                  onChange={(e) => handleStadeChange(index, 'nom', e.target.value)}
                />
              </div>
              <div className='form-group mb-2' style={{ display: 'flex', justifyContent: 'space-between' }}>
                <label>{`Description ${index + 1} `}</label>
                <input
                  type="text"
                  value={stade.description}
                  onChange={(e) => handleStadeChange(index, 'description', e.target.value)}
                />
              </div>
              <div className='form-group mb-2'>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={(e) => handleImageUpload(index, e)}
                />
              </div>
              <div className='row'>
                {stade.images.map((image, imgIndex) => (
                  <div key={imgIndex} className='col-md-4 mb-3'>
                    <p>Image {imgIndex + 1}:</p>
                    <img src={URL.createObjectURL(image)} alt={`Image ${imgIndex + 1}`} style={{ maxWidth: '100px' }} />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </Modal.Body>
         <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Close
          </Button>
          <Button id="sub_btn" type="submit">
            {bouton}
          </Button>
        </Modal.Footer>
      </form>}
    </Modal>
  );
}
