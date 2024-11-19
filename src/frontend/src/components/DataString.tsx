import React, { useState } from "react";

function DataString() {
  const [value, setValue] = useState<string>("sample text");
  const fetchedValue = "sample Text";/** the fetched value which will be given later a function as input */
  function HoverFunc() {
    
    setValue(fetchedValue);/**when the I get database values  */
  };

  return (
    <div style={{color: '#83cd9b' }}>
      <button style={{backgroundColor: '#83cd9b', fontFamily: 'Gabarito, sans-serif',
      fontWeight: 'bold',fontSize: '18px', border: 'none',

       }} className = "dataButton"
        onMouseEnter={HoverFunc} 
      >
        {value}
      </button>
      
    </div>
  );
};

export default DataString;