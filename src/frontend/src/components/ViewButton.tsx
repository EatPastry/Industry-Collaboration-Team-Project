import React from "react";

interface ViewButtonProps {
  label?: string;
  onClick?: () => Promise<void>;
}

const ViewButton: React.FC<ViewButtonProps> = ({ label = "View", onClick }) => {
  return (
    <button
      className="viewButton"
      onClick={onClick}
    >
      {label}
    </button>
  );
};

export default ViewButton;
