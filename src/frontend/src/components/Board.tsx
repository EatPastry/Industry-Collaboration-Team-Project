import React, {useEffect, useState} from 'react';

import ImageBox from './ImageBox';


function Board() {
  return (
    <div className="boardContainer">
      <h1>Top Brands</h1>
      <div>
        <ImageBox brand="currys" /> {/* replace "currys" with 1st brand */}
      </div>
      <div>
        <ImageBox brand="Holland And Barrett" />  {/* replace "Holland And Barrett" with 2nd brand */}
      </div>
      <div>
        <ImageBox brand="Sports Direct" />  {/* replace "Sports Direct" with 3rd brand */}
      </div>
      <div>

        <ImageBox brand="hp" /> {/* replace "hp" with 4th brand */}
      </div>
    </div>
  );
}

export default Board;