import React from 'react';
import Board from "../components/Board";
import MenuBar from "../components/MenuBar";



function Overview(){
    return (
        <>
        <MenuBar/>
        <div className="overview">
            <Board/>
        </div>
        </>
    );
}


export default Overview;


