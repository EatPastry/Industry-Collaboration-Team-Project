import React, {useEffect, useState} from 'react';
import {Slide, Fade, Zoom} from "react-awesome-reveal";

function Intro() {
    return (
        <div className="fullscreen" style={{background:"black"}}>
            <Zoom className="square-container" cascade duration={10000}>
            <div className="square black">
            <div className="square">
            <div className="square black">
            <div className="square">
            <div className="square black">
            <div className="square">
            <div className="square black">
            <div className="square">
            <div className="square black">
            <div className="square">
            <div className="square black">
            <div className="square">
            <div className="square black">
            <div className="square">
            <div className="square black">
            <div className="square">
            <div className="square black">
            <div className="square">
            <div className="square black">
            <div className="square">
            <div className="square black">
            <div className="square">
            <div className="square black">
            <div className="square">
            <div className="square black">
            <div className="square">
            <div className="square black">
            <div className="square">
            <div className="square black">
            </div>
            </div>
            </div>
            </div>
            </div>
            </div>
            </div>
            </div>
            </div>
            </div>
            </div>
            </div>
            </div>
            </div>
            </div>
            </div>
            </div>
            </div>
            </div>
            </div>
            </div>
            </div>
            </div>
            </div>
            </div>
            </div>
            </div>
            </div>
            
            </div>
            </Zoom>
            <div style={{paddingTop: "25vh", fontSize: "5vh", color: "white"}}>
            <Slide triggerOnce={true} cascade damping={0.6} duration={3000}>
                <p>Hello,</p>
                <p>You've had quite a year of saving</p>
                <p>Let's see how you did...</p>
            </Slide>
                
            </div>
            
        </div>
    )
}

export default Intro;