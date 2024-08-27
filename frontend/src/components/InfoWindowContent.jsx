import React, { useState } from 'react';


const InfoWindowContent = ({ suburbName }) => {
    return (
        <div className="infoWindowContent">
            <h3 className="infoWindowTitle">Suburb:</h3>
            <p className="infoWindowText" >{suburbName}</p>
        </div>
    )
};

export default InfoWindowContent;