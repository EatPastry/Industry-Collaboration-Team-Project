import React, { useState } from "react";

 // defines a prop of type Function
type DataStringProps = {
  functions: Function; 
};

/**
 * Component that displays a button.
 * The Buttons text changes upon hover
 * @param props
 * @returns A styled button component
 */
function DataString(props: DataStringProps) {
  const [value, setValue] = useState<string>("sample text");

    /**
     * Button handler for when mouse hovers over the button
     * Updates the buttons text
     */
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