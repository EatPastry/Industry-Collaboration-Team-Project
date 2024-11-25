import React, { useState } from "react";

type DataStringProps = {         // defines a prop of type Function          
  functions: Function; 
};

function DataString(props: DataStringProps) {
  const [value, setValue] = useState<string>("sample text"); 

  function HoverFunc() {
    const newValue = props.functions(); 
    setValue(newValue);
  }

  return (
    <div style={{ color: "#83cd9b" }}>
      <button
        style={{
          backgroundColor: "#83cd9b",
          fontFamily: "Gabarito, sans-serif",
          fontWeight: "bold",
          fontSize: "18px",
          border: "none",
        }}
        className="dataButton"
        onMouseEnter={HoverFunc} 
      >
        {value}
      </button>
    </div>
  );
}

export default DataString;