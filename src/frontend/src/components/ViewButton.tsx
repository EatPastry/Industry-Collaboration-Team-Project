import React from "react";

interface ViewButtonProps {
  label?: string;
  onClick?: () => Promise<void>;
}

const ViewButton: React.FC<ViewButtonProps> = ({ label = "View", onClick }) => {
  return (
    <button
      style={{
        backgroundColor: "#4169E1",
        color: "white",
        border: "none",
        borderRadius: "20px",
        padding: "8px 20px",
        fontSize: "1.2rem",
        fontWeight: "400",
        cursor: "pointer",
      }}
      onClick={onClick}
    >
      {label}
    </button>
  );
};

export default ViewButton;
