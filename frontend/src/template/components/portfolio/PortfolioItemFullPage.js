import React from 'react';
import {NavLink} from 'react-router-dom'

const PortfolioItemFullPage = ({className, number, title, thumb, category, character, navi}) => {
    return (
        <div id={`section-portfolio-featured-0${number}`} className={className}>
            <div className="fullscreen-slider-wrapper">
                <div className="feature-wrapper">
                    <div className="fullscreen-inner feature-info">
                        <div className={`post-character style-${number}`}>{character}</div>
                        <div className="inner">
                            <p className="bk_pra heading-font">{category}</p>
                            <h2 className="heading heading-h2 heading-font">
                                <span className="post-number">{number}</span>
                                <a href={`${process.env.PUBLIC_URL + '/'}`}>{title}</a>
                            </h2>
                            <div className="fullpage-btn mt--130">
                                {navi !== undefined ? 
                                    <NavLink to={`${process.env.PUBLIC_URL + navi}`}>
                                    Find One <i className="btn-icon"/>
                                    </NavLink>
                                : null}
                                
                            </div>
                        </div>
                    </div>
                    <div className="fullscreen-inner feature-thumbnail" style={{backgroundImage: `url(${thumb})`}}/>
                </div>
            </div>
        </div>
    );
};

export default PortfolioItemFullPage;
