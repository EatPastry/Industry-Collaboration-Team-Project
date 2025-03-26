import React, {useEffect, useState} from 'react';
import { motion } from 'framer-motion';
import {getCurrentUserTransactions, getSession, getEveryUsersTransactions} from "../../services/API";
import '../../styles/ComparativeStats.css';

/**
 * Returns comparative statistics between the current signed-in user and other users
 */
function ComparativeStats(){
    const [percentRank, setPercentRank] = useState(0);
    const [percentExplored, setPercentExplored] = useState(0);
    const [userLevel, setUserLevel] = useState(0);
    const [userRarity, setUserRarity] = useState("");
    const [rarityColour, setRarityColour] = useState("Black");
    const [xpProgress, setXpProgress] = useState(0); // For XP bar


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
                setXpProgress((((userLevel) % 15) / 15) * 100);
                break;
            }
        }

    }

    calculateComparativeStats()

    return (
        <div className="fullscreen">
            <br/>
            <motion.div
                className="stats-container"
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
            >
                <h1>Your UNiDAYS Recapped Story</h1>
                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5, duration: 1 }}
                >
                    Here's how you stack up against other UNiDAYS shoppers:
                </motion.p>

                <motion.ul>
                    <motion.li
                        initial={{ x: -100, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ delay: 0.8, duration: 0.8 }}
                    >
                        🏆 You're in the top <strong>{percentRank}%</strong> of shoppers!
                    </motion.li>
                    <motion.li
                        initial={{ x: -100, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ delay: 1, duration: 0.8 }}
                    >
                        🌟 Your shopping game is strong - you explored{' '}
                        <strong>{percentExplored}%</strong> more brands than average!
                    </motion.li>
                    <motion.li
                        initial={{ x: -100, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ delay: 1.2, duration: 0.8 }}
                    >
                        🎯 You are a Level <strong>{userLevel}</strong> saver of{' '}
                        <span style={{ color: rarityColour }}>{userRarity}</span> status!
                    </motion.li>
                </motion.ul>

                {/* XP Bar */}
                <motion.div
                    className="xp-bar-container"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1.5, duration: 1 }}
                >
                    <div className="xp-bar">
                        <motion.div
                            className="xp-progress"
                            style={{ width: `${xpProgress}%`, backgroundColor: rarityColour }}
                            initial={{ width: 0 }}
                            animate={{ width: `${xpProgress}%` }}
                            transition={{ delay: 1.8, duration: 1.5 }}
                        />
                    </div>
                    <p>Progress to next level: {xpProgress.toFixed(0)}%</p>
                </motion.div>

                <motion.p
                    className="share-message"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 2, duration: 1 }}
                >
                    Share your stats with friends and show off your shopping skills! 🚀
                </motion.p>
            </motion.div>
        </div>
    );
}


export default ComparativeStats;


