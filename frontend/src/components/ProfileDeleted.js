import React from 'react'
import {Jumbotron} from 'reactstrap'
import {Helmet} from "react-helmet";
import LayoutDefault from "../template/layouts/LayoutDefault";

const Home = () => {

    return(
        <div>
            <Helmet>
                <title>Group-Up Gamers || Goodbye</title>
            </Helmet>
            <LayoutDefault className="template-color-1 template-font-1">
            <Jumbotron>
                <h2>Account Deleted</h2>
                <hr/>
                <p className="lead">We're sorry to see you go!</p>
                <p>We hope to see you again some day. Until then, so long!</p>
            </Jumbotron>
            </LayoutDefault>
        </div>
    )
}

export default Home;