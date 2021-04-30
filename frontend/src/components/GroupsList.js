import React, {useEffect, useCallback, Fragment} from 'react';
import {Helmet} from "react-helmet";
import './css/GamesList.css';
import {useSelector, useDispatch} from 'react-redux';
import {getAllGroupsFromApi, resetGroupsState} from '../actions/groups'
import {NavLink} from 'react-router-dom';
import LayoutDefault from "../template/layouts/LayoutDefault";
import Breadcrumb from "../template/components/breadcrumb/BreadcrumbOne";
import {Container, Col, Row} from "react-bootstrap";
import BlogItem from "../template/components/blog/BlogItemFour";
import groupsbg from '../static/groupsbg.jpg'

const GroupsList = () => {
    const dispatch = useDispatch();
    // Resets the groups state to initial state of being empty
    const initialize = useCallback(
        () => {
            dispatch(resetGroupsState())
        },
        [dispatch],
    )

    useEffect(() => {initialize(); }, [initialize])

    const groups = useSelector(st => st.groups.groups);

    const missing = !groups;

    // Gets all the groups from the db and adds them to the state
    useEffect(function() {
        if(missing) {
            dispatch(getAllGroupsFromApi())
        }
    }, [missing, dispatch])

    

    if(missing) return (
        <Fragment>
            <Helmet>
                <title>Group-Up Gamers | Groups</title>
            </Helmet>
            <div className="mt-5 pt-5">
                <h2>No Groups Have Been Created</h2>
                <h5>You can make one <NavLink to="/groups/select">here!</NavLink></h5>
            </div>
        </Fragment>
    );

    // Backup in case the above fails
    if(!groups || !groups.length) return (
        <Fragment>
            <Helmet>
                <title>Group-Up Gamers | Groups</title>
            </Helmet>
            <div className="mt-5 pt-5">
                <h2>No Groups Have Been Created</h2>
                <h5>You can make one <NavLink to="/groups/select">here!</NavLink></h5>
            </div>
        </Fragment>
    );

    let groupsArr = Object.values(groups)

    return(
        <Fragment>
            <Helmet>
                <title>Group-Up Gamers | Groups</title>
            </Helmet>
            <LayoutDefault className="template-color-1 template-font-1">
                <Breadcrumb
                    title="Groups"
                    bg={groupsbg}
                />
                
                
                <div className="bk-blog-grid-area bg_color--5 section-ptb-150">
                    <Container>
                            <Fragment>
                                <Row className="mt--n60">
                                    {groupsArr.map(blog => (
                                        <Col lg={4} sm={6} key={blog.id}>
                                            <BlogItem
                                                data={blog}
                                                className="mt--60 blog-theme-color"
                                            />
                                        </Col>
                                    ))}
                                </Row>
                            </Fragment>
                    </Container>
                </div>

                                        <div className="mb-5">
                                            <NavLink to="groups/select" className="btn btn-lg btn-success">Make One!</NavLink>
                                        </div>
            </LayoutDefault>
        <div className="container d-flex flex-column align-items-center">
        </div>
        </Fragment>
    )
};

export default GroupsList;