import React from "react";
import Board from "../components/Board";
import { ShareFileButton } from "../components/ShareButton";
import ViewButton from "../components/ViewButton";

const Overview: React.FC = () => {
  const handleViewClick = () => {
    console.log("View button clicked!");
  };

  return (
    <div className="navBarWrapper">
      <div className="overview">
        <h1 style={{ fontSize: "4rem", fontWeight: "bold", textAlign: "center", color: "white", marginTop: "10px",maxWidth: "100%" }}>
          Your 2025 Recapped 
        </h1>

        {/* View Button */}
        <ViewButton label="View" onClick={handleViewClick} />

        {/* Main Content */}
        <div className="overview">
          <Board />
        </div>

        {/* Share Button */}
        <div className="share-container">
          <ShareFileButton />
        </div>
      </div>
    </div>
  );
};

export default Overview;
