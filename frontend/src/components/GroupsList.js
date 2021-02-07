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
    const initialize = useCallback(
        () => {
            dispatch(resetGroupsState())
        },
        [dispatch],
    )

    useEffect(() => {initialize(); }, [initialize])
    const groups = useSelector(st => st.groups.groups);

    const missing = !groups;


    useEffect(function() {
        if(missing) {
            dispatch(getAllGroupsFromApi())
        }
    }, [missing, dispatch])

    

    if(missing) return <h1 className="mt-5">Loading...</h1>;
    if(!groups || !groups.length) return (
        <>
        <h2>No Groups Have Been Created</h2>
        <h5>You can make one <NavLink to="/groups/select">here!</NavLink></h5>
        </>
    );
    let groupsArr = Object.values(groups)

    const data = [
        {
            "id": 5,
            "title": "1950s up to now Pop Music Defined",
            "thumb": "blog-05.jpg",
            "meta": {
                "postDate": "March 7, 2020",
                "category": "Photography",
                "author": "Ahammad"
            }
        },
        {
            "id": 6,
            "title": "Live Like a Bold lorem Superman",
            "thumb": "blog-06.jpg",
            "meta": {
                "postDate": "Sep 17, 2020",
                "category": "Camera",
                "author": "Yeasin"
            }
        },
        {
            "id": 7,
            "title": "Photography Careers That Pay the Bills",
            "thumb": "blog-07.jpg",
            "meta": {
                "postDate": "Oct 17, 2020",
                "category": "Interior",
                "author": "Tasnim"
            }
        },
        {
            "id": 8,
            "title": "What Motivates You to the Work?",
            "thumb": "blog-08.jpg",
            "meta": {
                "postDate": "Aug 27, 2020",
                "category": "Indoor",
                "author": "Sohel"
            }
        },
        {
            "id": 9,
            "title": "Niche Blogs for Rising Metal Bands",
            "thumb": "blog-09.jpg",
            "meta": {
                "postDate": "Jul 21, 2020",
                "category": "Playground",
                "author": "Raju Ahammad"
            }
        }
    ]
    

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


            </LayoutDefault>
        <div className="container d-flex flex-column align-items-center">
        </div>
        </Fragment>
    )
};

export default GroupsList;