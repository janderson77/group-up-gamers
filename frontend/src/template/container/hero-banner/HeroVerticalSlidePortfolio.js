import React from 'react';
import {NavLink} from 'react-router-dom'
import {Col, Row} from "react-bootstrap";

const HeroVerticalSlidePortfolio = () => {
    return (
        <div className="hero-vertical-slide-portfolio-wrapper bg_image--40 section">
            <div className="pl--150 pr--150 pl_lp--70 pr_lp--70 pl_lg--70 pr_lg--70 pl_md--50 pr_md--50 pl_sm--30 pr_sm--30">
                <Row>
                    <Col lg={8} className="m-auto text-center">
                        <div className="hero-vertical-slide-portfolio-content">
                            <h1 hidden>Group-Up Gamers</h1>
                            <h2>Group-Up Gamers</h2>
                            <NavLink
                                to={`${process.env.PUBLIC_URL + '/games'}`}
                                className="brook-btn bk-btn-theme btn-sd-size btn-rounded"
                            >
                                Get Started!
                            </NavLink>
                        </div>
                    </Col>
                    
                </Row>
            </div>
        </div>
    );
};

export default HeroVerticalSlidePortfolio;
