import React from 'react'
import { Card, Col, Container, Row } from 'react-bootstrap'
import { useUserData } from '../../contexts/UserDataContext'
import './style.css'
import Transition from '../../constants/transition';

function DashboardInfos() {
    const {rdvs, patients, medecins, maladies, secretaires} = useUserData();
  return (
    <Transition>
        <Container className='dashboard-container'>
      <Row>
        <Col lg={4}>
            <Card className='card'>
                <Card.Header className='head'>SECRETARY</Card.Header>
                <Card.Body className='card-number'>
                    {secretaires.length}
                </Card.Body>
                
            </Card>
        </Col>
        <Col lg={4}>
            <Card className='card'>
                <Card.Header className='head'>PATIENTS</Card.Header>
                <Card.Body className='card-number'>
                    {patients.length}
                </Card.Body>
                
            </Card>
        </Col>
        <Col lg={4}>
            <Card className='card'>
                <Card.Header className='head'>DOCTORS</Card.Header>
                <Card.Body className='card-number'>
                    {medecins.length}
                </Card.Body>
                
            </Card>
        </Col>
      </Row>
      <Row style={{marginTop:'10px'}}>
      <Col lg={6}>
            <Card className='card'>
                <Card.Header className='head'>APPOINTMENTS</Card.Header>
                <Card.Body className='card-number'>
                    {rdvs.length}
                </Card.Body>
                
            </Card>
        </Col>
        <Col lg={6}>
            <Card className='card'>
                <Card.Header className='head'>DISEASE</Card.Header>
                <Card.Body className='card-number'>
                    {maladies.length}
                </Card.Body>
                
            </Card>
        </Col>
      </Row>
    </Container>
    </Transition>
  )
}

export default DashboardInfos
