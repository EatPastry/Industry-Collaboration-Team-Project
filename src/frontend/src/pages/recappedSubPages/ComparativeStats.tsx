import React, {useEffect, useState} from 'react';
import {supabase} from "../../utils/supabase";

function ComparativeStats(){
    const [percentRank, setPercentRank] = useState(0);
    const [percentExplored, setPercentExplored] = useState(0);
    const [userLevel, setUserLevel] = useState(0);
    const [userRarity, setUserRarity] = useState("");
    const [rarityColour, setRarityColour] = useState("Black");

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
        const {data: {session}} = await supabase.auth.getSession();
        if (!session || !session.user) {
            return;
        }

        const userID = session.user.id;

        const {data : userTransactions} = await supabase
            .from('Transactions')
            .select('amountSpent, discountPercentage, partnerID')
            .eq('userID', userID)

        if (userTransactions === null) {
            return;
        }

        const savings = userTransactions.map(t => ((t.amountSpent * t.discountPercentage) / 100))
        const calculateTotalSaved = Math.floor(savings.reduce((sum, val) => sum + val, 0)) || 0


        const {data : allTransactions} = await supabase
            .from('Transactions')
            .select('userID, partnerID, amountSpent, discountPercentage')

        if (allTransactions === null) {
            return
        }

        const savingsPerUser =  allTransactions.reduce((sum:  Record<string, number>, t) => {
            const amountSaved = (t.amountSpent * t.discountPercentage) / 100

            if (!sum[t.userID]){
                sum[t.userID] = amountSaved;
            }else {
                sum[t.userID] += amountSaved;
            }
            return sum;
        }, {})

        const allSavings = Object.values(savingsPerUser).sort((a : number, b : number) => b - a);
        let rankUser = allSavings.findIndex(rank => rank <= calculateTotalSaved)

        // if find Index returns -1
        if (rankUser === -1) {
            rankUser = allSavings.length;
        }

        // Check all savings length to avoid division by zero
        if (allSavings.length === 0){
            setPercentRank(100);
        }else {
            setPercentRank(Number((100-((1 - (rankUser / (allSavings.length))) * 100)).toFixed(2)));
        }


        const brandsExplored = new Set(userTransactions.map(t => t.partnerID)).size;

        // Calculate the partners per each user, store them in a set
        const partnersPerUser = allTransactions.reduce((sum : Record<string, Set<string>>, t) => {
            if (!sum[t.userID]){
                sum[t.userID] = new Set();
            }
            sum[t.userID].add(t.partnerID);
            return sum;
        }, {})


        const avgPartnersPerUser = Object.values(partnersPerUser).reduce((sum, partners) => sum + partners.size, 0) / Object.keys(partnersPerUser).length


        if (brandsExplored === 0){
            setPercentExplored(0);
        }else {
            setPercentExplored(Number((((brandsExplored / avgPartnersPerUser) - 1) * 100).toFixed(2)));
        }

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
        <div>
            <br/>
            <header>
                <ul>
                    <li>You're in the top {percentRank}% of shoppers</li>
                    <li>Your shopping game is strong - you explored {percentExplored}% more brands than average</li>
                    <li>You are a Level {userLevel} saver of {' '}
                    <span style={{color: rarityColour}}>{userRarity}</span> status</li>
                </ul>
            </header>
        </div>
    );
}


export default ComparativeStats;


