import React, { useState } from 'react';
import CanvasJSReact from '@canvasjs/react-charts';
import { Card, Col, Container, Modal, Row } from 'react-bootstrap';

function Form_detail_consultation({ open, details, consultation }) {
    const [modalIsOpen, setModalIsOpen] = useState(open);
    const CanvasJSChart = CanvasJSReact.CanvasJSChart;
    const CanvasJS = CanvasJSReact.CanvasJS; // Ajoutez cette ligne pour importer CanvasJS

    const formatPercentage = (e) => {
        return CanvasJS.formatNumber(e.value, "#.#") + "%";
    };

    const options = {
        animationEnabled: true,
        theme: "light1",
        title: {
            text: "THE PROBABILITY OF BELONGING TO EACH DISEASE"
        },
        axisY: {
            title: "PERCENTAGE",
            labelFormatter: formatPercentage,
            scaleBreaks: {
                autoCalculate: true
            }
        },
        axisX: {
            title: "DISEASES",
            labelAngle: 0
        },
        data: [{
            type: "column",
            dataPoints: details
        }]
    };
    const handleCloseModal = () => {
        setModalIsOpen(false);
    }
    return (
        <Modal show={modalIsOpen} onHide={handleCloseModal} size="lg">
            <Modal.Header closeButton>
                <Modal.Title>Details consultation</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <CanvasJSChart options={options} />
                <Container className='chat-container' style={{ alignContent: "stretch" }}>
                    <Row>
                        <Col lg={6}>
                            <Card>
                                <Card.Header>DEGREE OF CERTAINTY</Card.Header>
                                <Card.Body>
                                    <span>PREDICATED DISEASE : </span>{consultation.maladie.nom} <br />
                                    CONFIDENCE :{consultation.probability}% == {(consultation.probability >= 70) ? "High" : "LOW"}
                                </Card.Body>
                            </Card>
                        </Col>
                        <Col lg={6}>
                            <Card>
                                <Card.Header>PRESCRIPTION</Card.Header>
                                <Card.Body>
                                    {consultation.prescription &&
                                        <ul>
                                            {consultation.prescription.map((item, index) => (
                                                <li key={index}>{item}</li>
                                            ))}
                                        </ul>
                                    }
                                </Card.Body>

                            </Card>
                        </Col>
                    </Row>
                    <Row style={{ marginTop: "10px" }}>
                        <Col lg={6}>
                            <Card>
                                <Card.Header>DISEASE SYMPTOMS</Card.Header>
                                <Card.Body>
                                    <ul>
                                        {consultation.descripSymptome.map((desc, index) => (
                                            <li key={index}>{desc}</li>
                                        ))}
                                    </ul>
                                </Card.Body>

                            </Card>
                        </Col>
                        <Col lg={6}>
                            <Card>
                                <Card.Header>DISEASE DESCRIPTION</Card.Header>
                                <Card.Body>
                                    {consultation.description}
                                </Card.Body>
                            </Card>
                        </Col>

                    </Row>
                    <Row style={{ marginTop: "10px" }}>
                        <Col lg={12}>
                            <Card>
                                <Card.Header>CONSULTATION IMAGE</Card.Header>
                                <Card.Body style={{justifyContent:'center'}}>
                                    <img src={consultation.imageName} alt="image" style={{width:'100%', height:'300px', margin:'auto'}}/>
                                </Card.Body>

                            </Card>
                        </Col>
                    </Row>
                </Container>
            </Modal.Body>
        </Modal>
    );
}

export default Form_detail_consultation;
