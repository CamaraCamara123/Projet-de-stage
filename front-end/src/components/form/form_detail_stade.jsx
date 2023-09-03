import React, { useState } from 'react';
import { Col, Container, Row } from 'react-bootstrap';
import { useUserData } from '../../contexts/UserDataContext';
import "./form.css"

function Form_detail_stade() {
    const { images, stade,maladie } = useUserData(); // Assurez-vous que images et stade sont correctement définis
    console.log(images.length);

    const imagesPerPage = 52;
    const totalPages = Math.ceil(images.length / imagesPerPage);

    const [currentPage, setCurrentPage] = useState(1);

    const handlePageChange = (newPage) => {
        setCurrentPage(newPage);
    };

    // Divisez les images en groupes de quatre pour chaque page
    const startIdx = (currentPage - 1) * imagesPerPage;
    const endIdx = currentPage * imagesPerPage;
    const visibleImages = images.slice(startIdx, endIdx);

    return (
        <Container className='image-container'>
            <Row>
                <Col>
                    <h2 className='titre'>{maladie.nom} stage details</h2>
                </Col>
            </Row>
            <Row className='img-row'>
                {visibleImages.map((image, index) => (
                    <Col key={index} lg={3} sm={6} xs={12}>
                        <figure>
                            <img
                                src={image.imagePath}
                                width={150}
                                height={150}
                                alt={image.title}
                            />
                            <figcaption>{image.title}</figcaption>
                        </figure>
                    </Col>
                ))}
            </Row>
            <Row className='justify-content-center'>
                <Col>
                    <div className='pagination'>
                        {Array.from({ length: totalPages }, (_, index) => (
                            <button
                                key={index}
                                onClick={() => handlePageChange(index + 1)}
                                className={currentPage === index + 1 ? 'active' : ''}
                                id="btn-page"
                            >
                                {index + 1}
                            </button>
                        ))}
                    </div>
                </Col>
            </Row>
        </Container>
    );
}

export default Form_detail_stade;