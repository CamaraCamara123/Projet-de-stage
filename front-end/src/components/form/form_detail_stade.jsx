import React, { useEffect, useState } from 'react';
import { Col, Container, Row } from 'react-bootstrap';
import { useUserData } from '../../contexts/UserDataContext';
import "./form.css"
import Loading from '../../constants/loading';

function Form_detail_stade() {
    const { images, path,maladie } = useUserData(); 
    const [ok, setOk] = useState(false);

    useEffect(()=>{
        if(images.length !=0){
            setOk(true);
        }
    },[images.length])
    const imagesPerPage = 52;
    const totalPages = Math.ceil(images.length / imagesPerPage);

    const [currentPage, setCurrentPage] = useState(1);

    const handlePageChange = (newPage) => {
        setCurrentPage(newPage);
    };

    const startIdx = (currentPage - 1) * imagesPerPage;
    const endIdx = currentPage * imagesPerPage;
    const visibleImages = images.slice(startIdx, endIdx);

    return (
        <Container className='image-container'>
            <Row className='titre-stade-container'>
                <Col>
                    <h2 className='titre-stade'>{maladie.nom} stage details</h2>
                </Col>
            </Row>
            {!ok&&<Row>
                <Col>
                    <Loading/>
                </Col>
            </Row>}
            {ok&&<>
            <Row className='img-row'>
                {visibleImages.map((image, index) => (
                    <Col key={index} lg={3} sm={6} xs={12}>
                        <figure>
                            <img
                                src={`${path}/uploads/${image.imagePath}`}
                                width={150}
                                height={150}
                                alt={image.title}
                                className='img-stade'
                            />
                            <figcaption>{image.title}</figcaption>
                        </figure>
                    </Col>
                ))}
            </Row>
            <Row className='pagination-container'>
                <Col>
                    <div className='pagination'>
                        {Array.from({ length: totalPages }, (_, index) => (
                            <button
                                key={index}
                                onClick={() => handlePageChange(index + 1)}
                                className={currentPage === index + 1 ? 'active-btn' : 'notActive'}
                                
                            >
                                {index + 1}
                            </button>
                        ))}
                    </div>
                </Col>
            </Row>
            </>}
        </Container>
    );
}

export default Form_detail_stade;