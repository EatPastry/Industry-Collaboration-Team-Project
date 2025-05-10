import {useNavigate} from 'react-router-dom';
import React, {useEffect, useState} from 'react';
import { getAllUsers, getUserFullName, getUserTransactions } from '../services/API';
import { color } from 'motion-dom';
import "../styles/leaderboard.css";
import zIndex from '@mui/material/styles/zIndex';

function Leaderboard() {
    const [currentLeader, setCurrentLeader] = useState<number | null>(null);
    const [leaderSavings, setLeaderSavings] = useState<string | null>(null);
    async function calculateLeader(): Promise<void> {
            const userIDs = await getAllUsers();
            if (!userIDs){
                return;
            }
            // Calculate the Saving for each transaction for the current signed-in user, then Sum these Savings
            const usersWithTransactions = await Promise.all(
                userIDs.map(async (user) => {
                  const transactions = await getUserTransactions(user.userID);
                  if (!transactions){
                    return;
                    }
                  const savings = transactions.map(t => ((t.amountSpent * t.discountPercentage) / 100))
                  const calculateTotalSaved = Math.floor(savings.reduce((sum, val) => sum + val, 0)) || 0
                    //.filter(tx => tx.type === 'savings')
                    //.reduce((sum, tx) => sum + tx.amount, 0);
            
                  return { userID: user.userID, calculateTotalSaved };
                })
              );
            
              const topUser = usersWithTransactions.reduce((max, user) => 
                user!.calculateTotalSaved > max!.calculateTotalSaved ? user : max
              );

              const leaderName = await getUserFullName(topUser?.userID);
              if (!leaderName){
                return;
                }

              setCurrentLeader(leaderName)

              function getFormattedString() {
                let x = topUser!.calculateTotalSaved.toString();
                var pattern = /(-?\d+)(\d{3})/;
                while (pattern.test(x))
                    x = x.replace(pattern, "$1,$2");
                return "£" + x + ".00";
            }

              setLeaderSavings(getFormattedString());
            // setTimeout(() => {
            //     setFinalSaved(totalSaved!);
            // }, 2000);
    
        }
    
        // So that it only runs when a change occurs and not every rerender
        useEffect(() => {
          calculateLeader();
        }, []);

        setTimeout(() => {
            calculateLeader();
        }, 10000);

        

    return (
        <div>
       
            <div style={{fontSize: '72px', color: 'white', textAlign: 'center', width: '100vw', marginTop: '30px'}}>Current <img className="colour-invert" width="250px" alt = "UNiDAYS" src="https://assets1.unidays.world/v5/main/assets/images/logo_v003.svg"></img> Top Saver</div>
            <div style={{marginTop: '20vh', width: "100vw", display: "flex", justifyContent: "center"}}>
              <div className="shadow" style={{width: "500px", backgroundColor: '#1343de', borderRadius: '20px', padding: '20px', zIndex: '1'}}>
                <div style={{fontSize: '64px', color: 'white', textAlign: 'center'}}>{currentLeader}</div>
                <div style={{fontSize: '64px', color: 'white', textAlign: 'center'}}>{leaderSavings}</div>
              </div>
            </div>
            <div className="container-money" style={{zIndex: '0'}}>
	            <div className="loader">
              {Array.from({ length: 26 }).map((_, i) => (
                <span key={i}></span>
              ))}
              </div>
            </div>
      </div>
    )
}

export default Leaderboard;