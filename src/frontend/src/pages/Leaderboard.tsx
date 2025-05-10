import {useNavigate} from 'react-router-dom';
import React, {useEffect, useState} from 'react';
import { getAllUsers, getUserFullName, getUserTransactions } from '../services/API';
import { color } from 'motion-dom';
import "../styles/leaderboard.css";
import zIndex from '@mui/material/styles/zIndex';

// const audio = new Audio('.../public/bell.mp3');

function Leaderboard() {
    const [first, setFirst] = useState<string | null>(null);
    const [second, setSecond] = useState<string | null>(null);
    const [third, setThird] = useState<string | null>(null);
    const [fourth, setFourth] = useState<string | null>(null);
    const [fifth, setFifth] = useState<string | null>(null);
    const [firstSavings, setFirstSavings] = useState<string | null>(null);
    const [secondSavings, setSecondSavings] = useState<string | null>(null);
    const [thirdSavings, setThirdSavings] = useState<string | null>(null);
    const [fourthSavings, setFourthSavings] = useState<string | null>(null);
    const [fifthSavings, setFifthSavings] = useState<string | null>(null);
    // let prevUserID : string;
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
            
              // const topUser = usersWithTransactions.reduce((max, user) => 
              //   user!.calculateTotalSaved > max!.calculateTotalSaved ? user : max
              // );

              const topUsers = usersWithTransactions.sort((a, b) => b!.calculateTotalSaved - a!.calculateTotalSaved).slice(0, 5);

              
              //   audio.play();

              // if(topUsers[0]!.userID.toString() != prevUserID) {
                
              // }

              //   prevUserID = topUsers[0]!.userID.toString();
              setFirst(await getUserFullName(topUsers[0]!.userID));
              setSecond(await getUserFullName(topUsers[1]!.userID));
              setThird(await getUserFullName(topUsers[2]!.userID));
              setFourth(await getUserFullName(topUsers[3]!.userID));
              setFifth(await getUserFullName(topUsers[4]!.userID));
              setFirstSavings((getFormattedString(topUsers[0]!.calculateTotalSaved)));
              setSecondSavings((getFormattedString(topUsers[1]!.calculateTotalSaved)));
              setThirdSavings((getFormattedString(topUsers[2]!.calculateTotalSaved)));
              setFourthSavings((getFormattedString(topUsers[3]!.calculateTotalSaved)));
              setFifthSavings((getFormattedString(topUsers[4]!.calculateTotalSaved)));
              //setCurrentLeader(leaderName)

            function getFormattedString(val : number) {
                let x = val.toString();
                var pattern = /(-?\d+)(\d{3})/;
                while (pattern.test(x))
                    x = x.replace(pattern, "$1,$2");
                return "£" + x + ".00";
            }

            //  setLeaderSavings(getFormattedString());
    
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
              <div className="shadow" style={{width: "1200px", backgroundColor: '#1343de', borderRadius: '20px', padding: '20px', zIndex: '1'}}>
                <div style={{fontSize: '64px', color: 'gold', textAlign: 'center', marginBottom: '20px'}}>🏆 {first} {firstSavings}</div>
                <div style={{fontSize: '64px', color: 'white', textAlign: 'center', marginBottom: '20px'}}>2. {second} {secondSavings}</div>
                <div style={{fontSize: '64px', color: 'white', textAlign: 'center', marginBottom: '20px'}}>3. {third} {thirdSavings}</div>
                <div style={{fontSize: '64px', color: 'white', textAlign: 'center', marginBottom: '20px'}}>4. {fourth} {fourthSavings}</div>
                <div style={{fontSize: '64px', color: 'white', textAlign: 'center'}}>5. {fifth} {fifthSavings}</div>
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