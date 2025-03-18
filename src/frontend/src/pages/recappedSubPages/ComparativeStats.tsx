import React, {useEffect, useState} from 'react';
import {getCurrentUserTransactions, getSession, getEveryUsersTransactions} from "../../services/API";

/**
 * Returns comparative statistics between the current signed-in user and other users
 */
function ComparativeStats(){
    const [percentRank, setPercentRank] = useState(0);
    const [percentExplored, setPercentExplored] = useState(0);
    const [userLevel, setUserLevel] = useState(0);
    const [userRarity, setUserRarity] = useState("");
    const [rarityColour, setRarityColour] = useState("Black");


    // Map levels to the rarity of the level and the css colour that should be displayed
    const levelMap = [
        [15, 'Common', 'green'],
        [30, 'Rare', 'darkblue'],
        [45, 'Epic', 'purple'],
        [60, 'Legendary', 'red'],
        [75, 'Mythic', 'lightblue'],
        [90, 'Ultra', 'darkred'],
        [100, 'Super', 'lightgreen'],
    ]


    async function calculateComparativeStats(){
        const session = await getSession();

        if (!session){
            return;
        }

        const userID = session.user.id;

        const userTransactions = await getCurrentUserTransactions();
        if (!userTransactions){
            return;
        }

        // Calculate the Savings for each transaction, then sum to find total savings
        const savings = userTransactions.map(t => ((t.amountSpent * t.discountPercentage) / 100))
        const calculateTotalSaved = Math.floor(savings.reduce((sum, val) => sum + val, 0)) || 0

        // Get transactions for all users
        const allTransactions = await getEveryUsersTransactions();
        if (!allTransactions){
            return;
        }

        // Calculate the total savings for each user in the transactions table
        const savingsPerUser =  allTransactions.reduce((sum:  Record<string, number>, t) => {
            const amountSaved = (t.amountSpent * t.discountPercentage) / 100

            if (!sum[t.userID]){
                sum[t.userID] = amountSaved;
            }else {
                sum[t.userID] += amountSaved;
            }
            return sum;
        }, {})

        // Sort by savings per user to find the user savings rank
        const allSavings = Object.values(savingsPerUser).sort((a : number, b : number) => b - a);
        let rankUser = allSavings.findIndex(rank => rank <= calculateTotalSaved)

        // if findUser Index is -1
        if (rankUser === -1) {
            rankUser = allSavings.length;
        }

        // Check all savings length to avoid division by zero
        if (allSavings.length === 0){
            setPercentRank(100);
        }else {
            // Calculate the Percentile rank for the current user
            setPercentRank(Number((100-((1 - (rankUser / (allSavings.length))) * 100)).toFixed(2)));
        }

        // Calculate the set of brands the current user has purchased from
        const brandsExplored = new Set(userTransactions.map(t => t.partnerID)).size;

        // Calculate the partners per each user, store them in a set
        const partnersPerUser = allTransactions.reduce((sum : Record<string, Set<string>>, t) => {
            if (!sum[t.userID]){
                sum[t.userID] = new Set();
            }
            sum[t.userID].add(t.partnerID);
            return sum;
        }, {})

        // Calculate the average number of partners per user
        const avgPartnersPerUser = Object.values(partnersPerUser).reduce((sum, partners) => sum + partners.size, 0) / Object.keys(partnersPerUser).length


        if (brandsExplored === 0){
            setPercentExplored(0);
        }else {
            // Calculate percentage deviation from the average of brands explored
            setPercentExplored(Number((((brandsExplored / avgPartnersPerUser) - 1) * 100).toFixed(2)));
        }

        // Set the user level, and the corresponding userRarity and colour using the levelMap 2d arr
        setUserLevel(Math.floor(100-percentRank))
        for (let i = 0; i < levelMap.length; i++) {
            if (levelMap[i][0] > (userLevel)){
                setUserRarity(levelMap[i][1].toString());
                setRarityColour(levelMap[i][2].toString())
                break;
            }
        }

    }

    calculateComparativeStats()

    return (
        <div className="fullscreen">
            <br/>
                <ul>
                    <li>You're in the top {percentRank}% of shoppers</li>
                    <li>Your shopping game is strong - you explored {percentExplored}% more brands than average</li>
                    <li>You are a Level {userLevel} saver of {' '}
                    <span style={{color: rarityColour}}>{userRarity}</span> status</li>
                </ul>
        </div>
    );
}


export default ComparativeStats;


