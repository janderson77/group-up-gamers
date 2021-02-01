import React from 'react'
import {Jumbotron} from 'reactstrap'

const Home = () => {

    return(
        <div>
            <Jumbotron>
                <h2>Account Deleted</h2>
                <hr/>
                <p className="lead">We're sorry to see you go!</p>
                <p>We hope to see you again some day. Until then, so long!</p>
            </Jumbotron>
        </div>
    )
}

export default Home;