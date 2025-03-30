import React from "react";
import Board from "../components/Board";
import ViewButton from "../components/ViewButton";
import {NavigateFunction, useLocation, useNavigate} from 'react-router-dom';
import {supabase} from '../utils/supabase'





const Overview: React.FC = () => {
  const navigation = useNavigate(); 

  async function handleViewClick() { 
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session || !session.user) return;
      navigation(`/pages/Story/${session.user.id}`);
    } catch (err) {
      console.error("Unexpected error:", err);
    }
  }
  
  
  

  return (
    <div className="navBarWrapper">
      <div className="overview">
        <h1 className ="yourRecapped">
          Your 2025 Recapped
        </h1>

        {/* View Button */}
        <ViewButton label="View" onClick={handleViewClick} />

        {/* Main Content */}
        <div className="overview">
          <Board />
        </div>

        {/* Share Button */}
        <div>
        
        </div>
      </div>
    </div>
  );
};

export default Overview;
