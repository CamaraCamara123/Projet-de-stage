import React, { useEffect, useState } from 'react';
import CanvasJSReact from '@canvasjs/react-charts';
import { Card, Col, Container, Modal, Row } from 'react-bootstrap';


function Form_detail_diagnostic({ open, details, type, diagnostic }) {
    const [modalIsOpen, setModalIsOpen] = useState(open);
    const CanvasJSChart = CanvasJSReact.CanvasJSChart;
    const CanvasJS = CanvasJSReact.CanvasJS; 
    

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
            type: type,
            dataPoints: details
        }]
    };
    const handleCloseModal = () => {
        setModalIsOpen(false);
    }
    return (
        <Modal show={modalIsOpen} onHide={handleCloseModal} size="lg">
            <Modal.Header closeButton>
                <Modal.Title>Details diagnostic</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <CanvasJSChart options={options} />
                <Container className='chat-container' style={{ alignContent: "stretch" }}>
                    <Row>
                        <Col lg={6}>
                            <Card>
                                <Card.Header>DEGREE OF CERTAINTY</Card.Header>
                                <Card.Body>
                                    <span>PREDICATED DISEASE : </span>{diagnostic.maladie.nom} <br />
                                    CONFIDENCE :{diagnostic.probability}% == {(diagnostic.probability >= 70) ? "High" : "LOW"}
                                </Card.Body>
                            </Card>
                        </Col>
                        <Col lg={6}>
                            <Card>
                                <Card.Header>PRESCRIPTION</Card.Header>
                                <Card.Body>
                                    {diagnostic.prescription &&
                                        <ul>
                                            {diagnostic.prescription.map((item, index) => (
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
                                        {diagnostic.descripSymptome.map((desc, index) => (
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
                                    {diagnostic.description}
                                </Card.Body>
                            </Card>
                        </Col>

                    </Row>
                    <Row style={{ marginTop: "10px" }}>
                        <Col lg={12}>
                            <Card>
                                <Card.Header>diagnostic IMAGE</Card.Header>
                                <Card.Body style={{justifyContent:'center'}}>
                                    <img src={`http://192.168.11.104:5000/uploads/${diagnostic.imagePath}`} alt={diagnostic.imageName} style={{width:'100%', height:'300px', margin:'auto'}}/>
                                </Card.Body>

                            </Card>
                        </Col>
                    </Row>
                </Container>
            </Modal.Body>
        </Modal>
    );
}

export default Form_detail_diagnostic;
