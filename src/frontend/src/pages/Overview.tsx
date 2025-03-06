import React from 'react';
import Board from "../components/Board";
import MenuBar from "../components/MenuBar";



function Overview(){
    return (
        <>
        <div className = "navBarWrapper">
            <div className="overview">
                <Board/>
            </div>
        </div>
        </>
    );
}


export default Overview;


