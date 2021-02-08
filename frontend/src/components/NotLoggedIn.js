import React, {Fragment} from 'react';
import {Helmet} from "react-helmet";
import {Col, Container, Row} from "react-bootstrap";
import {NavLink} from 'react-router-dom';
import LayoutDefault from "../template/layouts/LayoutDefault";

const NotLoggedIn = () => {
    return(
        <Fragment>
        <Helmet>
            <title>Group-Up Gamers || Group Admin</title>
        </Helmet>
        <LayoutDefault className="template-color-1 template-font-1">

        <div className="brook-blog-details-area bg_color--1 pt--90 pb--150" style={{minHeight: '55rem'}}>
        
            <Container>
                <Row>
                    <Col lg={8} className={'mx-auto'}>
                        <h1 className="heading">You must be logged in to see this.</h1>
                        <NavLink className="nav-link me-2 btn btn-lg btn-primary mt-5" to="/login"  >Login/register</NavLink>
                    </Col>
                </Row>
            </Container>
        </div>
        </LayoutDefault>
        </Fragment>
    )
}

export default NotLoggedIn