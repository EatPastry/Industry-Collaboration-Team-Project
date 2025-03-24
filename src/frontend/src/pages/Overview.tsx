import React from "react";
import Board from "../components/Board";
import { ShareFileButton } from "../components/ShareButton";
import ViewButton from "../components/ViewButton";
import {NavigateFunction, useLocation, useNavigate} from 'react-router-dom';
import {ProtectUserRoutes} from '../components/ProtectRoutes';
import {supabase} from '../utils/supabase'





const Overview: React.FC = () => {
  const navigation = useNavigate(); 

  async function handleViewClick() { 
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session || !session.user) return;
      navigation(`/pages/Recapped.tsx/${session.user.id}`);
    } catch (err) {
      console.error("Unexpected error:", err);
    }
  }
  
  
  

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
