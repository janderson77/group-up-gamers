import React from 'react';
import {Container, Row, Col} from 'react-bootstrap'
import {NavLink} from 'react-router-dom'

const BreadcrumbOne = ({title, bg, prev, stem}) => {
    return (
        <div
            className="breadcrumb-area pt--200 pt_lg--300 pt_md--250 pt_sm--200 pb--100 breadcrumb-title-bar breadcrumb-title-white"
            style={{backgroundImage: `url(${bg})`}}>
            <Container>
                <Row>
                    <Col xs={12}>
                        <div className="breadcrumb-inner text-center">
                            <h2 className="heading">{title}</h2>
                            <div className="breadcrumb-inside">
                                <ul className="core-breadcrumb">
                                    <li key="home"><NavLink to={`/`}>Home</NavLink></li>
                                    {prev ? prev.map(e => (<li key={e.title}>
                                        {`/${e.title.toLowerCase()}` === stem ? 
                                        <NavLink  to={`/${e.title.toLowerCase()}`}>
                                            {e.title}
                                        </NavLink>
                                        : <NavLink to={`${stem.toLowerCase()}/${e.title.toLowerCase()}`}>
                                                {e.title}
                                            </NavLink>}
                                        
                                        
                                        </li>)): null}
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