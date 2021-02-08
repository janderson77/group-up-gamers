import React from 'react';

const AboutThumbOne = ({className, thumb, imgClass}) => {
    return (
        <div className={`thumb text-left wow move-up ${className && className}`}>
            <img src={thumb} className={imgClass} alt="thumb"/>
        </div>
    );
};

export default AboutThumbOne;
