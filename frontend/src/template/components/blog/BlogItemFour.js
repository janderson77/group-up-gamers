import React from 'react';
import {NavLink} from "react-router-dom";
import PropTypes from 'prop-types';
import Default from '../../../static/Default.png';

const BlogItemFour = ({data, className}) => {
    return (
        <div className={`blog-grid blog-grid--modern blog-standard ${className}`}>
            <div className="post-thumb">
                <NavLink to={`/groups/${data.id}`}>
                    {data.group_logo_url ? <img src={data.group_logo_url} alt={data.group_name}/>: <img src={Default} alt={data.group_name}/>}
                    
                </NavLink>
            </div>
            <div className="post-content text-center">
                <div className="post-inner">
                    <div className="post-meta mb--10">
                        {/* <div className="post-date">{data.meta.postDate}</div>
                        <div className="post-category">
                            <Link to={`${process.env.PUBLIC_URL + '/blog-details'}`}>{data.meta.category}</Link></div> */}
                        <div className="post-date">
                            <NavLink to={`/games/${data.game_slug}`}>{data.game_name}</NavLink>
                        </div>
                    </div>
                    <h5 className="heading heading-h5 line-height-1-39">
                        <NavLink to={`/groups/${data.id}`}>{data.group_name}</NavLink>
                    </h5>
                    <NavLink to={`/groups/${data.id}`} className="post-read-more">&nbsp;</NavLink>
                </div>
            </div>
        </div>
    );
};

BlogItemFour.propTypes = {
    data: PropTypes.object
};

export default BlogItemFour;
