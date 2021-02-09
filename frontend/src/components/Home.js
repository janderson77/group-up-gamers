import React, {Fragment} from 'react'
import {Helmet} from "react-helmet";
import LayoutDefault from '../template/layouts/LayoutDefault'
import LayoutFullPage from '../template/layouts/LayoutFullPage'
// import {Jumbotron} from 'reactstrap'
import HeroBanner from '../template/container/hero-banner/HeroVerticalSlidePortfolio';
import PortfolioItem from '../template/components/portfolio/PortfolioItemFullPage';
import portfolios from '../template/data/portfolio/portfolio-two.json'
import {licenseKey} from '../secrets'


const Home = () => {
    const characters = ['G', 'G', 'P'];
    const links = ['games', 'groups'];

    const options = {
        navigation: true,
        licenseKey: licenseKey
        
    }
    return(
        <div>
            <Fragment>
                <Helmet>
                    <title>Group-Up Gamers | Home</title>
                </Helmet>
                <LayoutDefault className="template-color-3 template-font-1" revealFooter={true}>
                    <LayoutFullPage options={options} >
                    <HeroBanner />
                    {portfolios.slice(0, 3).map(portfolio => (
                            <PortfolioItem
                                key={portfolio.id}
                                number={portfolio.id}
                                title={portfolio.title}
                                thumb={require('../template/assets/img/portfolio/fullscreen/' + portfolio.thumb)}
                                character={characters[portfolio.id - 1]}
                                navi={links[portfolio.id-1]}
                                className="section"
                            />
                        ))}
                    
                    </LayoutFullPage>
                </LayoutDefault>
            </Fragment>
        </div>
    )
}

export default Home;