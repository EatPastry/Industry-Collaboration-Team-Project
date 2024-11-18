import React, { useState } from "react";

function DataString() {
  const [value, setValue] = useState<string>("sample text");
  const fetchedValue = "";/** the fetched value which will be given later */
  function HoverFunc() {
    
    setValue(fetchedValue);/**when the I get database values  */
  };

  return (
    <div>
      <button className = "dataButton"
        onMouseEnter={HoverFunc} 
      >
        Sample text
      </button>
      <p>{value}</p> {}
    </div>
  );
};

export default DataString;