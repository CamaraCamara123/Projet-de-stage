import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useUserData } from '../../contexts/UserDataContext';
import { Link, Navigate } from 'react-router-dom';
import axios from 'axios';
import "./style.css"
import Transition from '../../constants/transition';

function Login() {
  const { login, isLoggedIn } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const { path } = useUserData();
  const [errorMessage, setErrorMessage] = useState("");

  if (localStorage.getItem('user')) {
    login()
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(`${path}/login`, {
        username,
        password,
      });

      if (response.status === 200) {
        const token = response.data.token;

        // Stockez le token JWT dans le stockage local
        localStorage.setItem('token', token);
        // Ajoutez le token JWT aux en-têtes de toutes les requêtes Axios ultérieures
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

        console.log(response.data.token);
        login();
      }
    } catch (error) {
      console.error('Erreur d\'authentification', error);
      setErrorMessage("Username or password incorrect")
    }
  };

  if (isLoggedIn) {
    return <Navigate to='/dashboard' />;
  }

  return (
    <Transition>
      <section className="vh-100 gradient-custom" style={{ height: '100vh' }}>
        <div className="row d-flex justify-content-center align-items-center h-100" style={{ margin: "auto" }}>
          <div className="col-12 col-md-8 col-lg-6 col-xl-5">
            <div className="card bg-dark text-white" style={{ borderRadius: '1rem', height: '85vh', display: '-ms-flexbox', justifyContent: 'center' }}>
              <div className="card-body p-5 text-center">
                <div className="mb-md-5 mt-md-4 pb-5">
                  <h2 className="fw-bold mb-2 text-uppercase">Login</h2>
                  <p className="text-white-50 mb-5">Please enter your login and password!</p>
                  <form onSubmit={handleSubmit} >
                    <div className="form-outline form-white mb-4 error-container">
                      {errorMessage && <p className="error-message">{errorMessage}</p>}
                    </div>
                    <div className="form-outline form-white mb-4">
                      <input
                        type="text"
                        id="typeEmailX"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        className="form-control form-control-lg" />
                      <label className="form-label" for="typeEmailX">Username</label>
                    </div>

                    <div className="form-outline form-white mb-4">
                      <input
                        type="password"
                        id="typePasswordX"
                        className="form-control form-control-lg"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}

                      />
                      <label className="form-label" for="typePasswordX">Password</label>
                    </div>

                    <p className="small mb-2 pb-lg-2"><a className="text-white-50" href="#!">Forgot password?</a></p>
                    <div className="form-outline form-white mb-2">
                      <button className="btn btn-outline-light btn-lg px-5" type="submit" onClick={handleSubmit}>Login</button>
                    </div>
                  </form>
                </div>

              </div>
            </div>
          </div>
        </div>
      </section>
    </Transition>

  );
}

export default Login;
