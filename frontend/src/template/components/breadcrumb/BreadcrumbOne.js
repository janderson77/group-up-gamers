import React from 'react';
import {Container, Row, Col} from 'react-bootstrap'
import {NavLink} from 'react-router-dom'

const BreadcrumbOne = ({title, bg}) => {
    return (
        <div
            className="breadcrumb-area pt--400 pt_lg--300 pt_md--250 pt_sm--200 pb--100 breadcrumb-title-bar breadcrumb-title-white"
            style={{backgroundImage: `url(${bg})`}}>
            <Container>
                <Row>
                    <Col xs={12}>
                        <div className="breadcrumb-inner text-center">
                            <h2 className="heading">{title}</h2>
                            <div className="breadcrumb-inside">
                                <ul className="core-breadcrumb">
                                    <li><NavLink to={`/`}>Home</NavLink></li>
                                    <li className="current">{title}</li>
                                </ul>
                            </div>
                        </div>
                    </Col>
                </Row>
            </Container>
        </div>
    );
};

export default BreadcrumbOne;