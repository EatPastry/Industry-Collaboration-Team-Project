import React, {useEffect, useState} from 'react';
import {NavigateFunction, useLocation, useNavigate} from 'react-router-dom';
import {ProtectUserRoutes} from '../components/ProtectRoutes';
import {supabase} from '../utils/supabase'
import {clearCookie, parseToken} from "../services/Authentication";
import {getFirstName} from "../services/API";
import GPTFacts from "./storyPages/GPTFacts";
import ViewButton from "../components/ViewButton";
import Board from "../components/Board";



/**
 * Checks every 3 seconds that the session is still active <br>
 * if the session is stale it logs the user out by clearing cookies
 *
 * @param navigation of useNavigate() to navigate to Log in (/) page
 */
export function checkSession(navigation : NavigateFunction){
  return setInterval(async () => {
    let { error} = await supabase.auth.getUser();
    if (error) {
      clearCookie(parseToken());
      navigation(`/`);
    }
  }, 3000)
}



/**
 * Generates Recapped page for logged in user
 */
function Recapped() {
  const navigation = useNavigate();
  const location = useLocation();

  //Recapped SubPage state Handling
  const [gptFacts, setGptFacts] = useState(false);


  /**
   * When one subpage is returned when its corresponding button is pressed
   * the other subpage states should be set to false
   */
   function toggleSubPages(subpage : string){
    setGptFacts(subpage == "gptFacts")
  }


  useEffect(() => {
    // Log user out if without session
    const hasSession = checkSession(navigation)

    return () => {
      clearInterval(hasSession)
    };
  }, [location.pathname, navigation]);

  // Check that the current user has http cookie necessary for Recapped access
  const protectionError = ProtectUserRoutes(location.pathname);
  if (protectionError != null) {
    return protectionError;
  }

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
            </div>
        );
      </div>
);}


export default Recapped;