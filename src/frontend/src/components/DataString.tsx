import React, { useState } from "react";

type DataStringProps = {
  functions: Function; // Accepts a regular function as a prop
};

function DataString(props: DataStringProps) {
  const [value, setValue] = useState<string>("sample text");

  function HoverFunc() {
    const newValue = props.functions(); // Call the passed function
    setValue(newValue); // Update the state with the fetched value
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
        onMouseEnter={HoverFunc} // Trigger HoverFunc on mouse enter
      >
        {value}
      </button>
    </div>
  );
}

export default DataString;