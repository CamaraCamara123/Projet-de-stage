import React from 'react';
import './home.css'
import './styles.css'
import { useUserData } from '../contexts/UserDataContext';
import Transition from '../constants/transition';
import { Card, Col, Container, Row } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrashAlt } from '@fortawesome/free-solid-svg-icons';

function Home() {
  const { userData } = useUserData()
  return (
    <Transition>
      <div className='home-container' style={{ height: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
      {/* <div className='home-title-container'>
        <h1 className='home-title'>WELCOME ON DERMATO PAGE</h1>
      </div> */}
        <Row style={{margingTop:'0px'}}>
          <Col style={{margingTop:'0px'}}>
            <Container className='card-container-home'>
              <Row>
                <Col>
                  <Card className='home-card'>
                    <Card.Header><FontAwesomeIcon icon={faTrashAlt} /></Card.Header>
                    <Card.Body className='home-card-body'>
                      <p>This report presents a comprehensive overview of my year-end internship at Z SMART SERVICES,
                        detailing the tasks undertaken and achievements accomplished..</p>
                    </Card.Body>
                  </Card>
                </Col>
                <Col>
                  <Card className='home-card'>
                    <Card.Header><FontAwesomeIcon icon={faTrashAlt} /></Card.Header>
                    <Card.Body className='home-card-body'>
                      <p>This report presents a comprehensive overview of my year-end internship at Z SMART SERVICES,
                        detailing the tasks undertaken and achievements accomplished.</p>
                    </Card.Body>
                  </Card>
                </Col>
              </Row>
            </Container>
          </Col>
          <Col>

          </Col>
        </Row>
      </div>
    </Transition>
  );
}

export default Home;
