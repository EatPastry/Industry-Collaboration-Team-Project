import React, {useEffect, useState} from 'react';
import {supabase} from "../../utils/supabase";



function Savings(){
    const [totalSaved, setTotalSaved] = useState<number | null>(null);
    const [numMonthsNetflix, setNumMonthsNetflix] = useState<number | null>(null);
    const [bestDay, setBestDay] = useState<string | null>(null);
    const [bestDayAmount, setBestDayAmount] = useState<number | null>(null);
    const [userPercentile, setUserPercentile] = useState<string | null>(null);
    const [numGroceryWeeks, setGroceryWeeks] = useState<number | null>(null);


    async function calculateSavings(): Promise<void> {
        const {data: {session}} = await supabase.auth.getSession();
        if (!session || !session.user) {
            return;
        }

        const userID = session.user.id;

        const {data: userTransactions} = await supabase
            .from("Transactions")
            .select("*")
            .eq("userID", userID)

        if (userTransactions == null) {
            return;
        }

        const savings = userTransactions.map(t => ((t.amountSpent * t.discountPercentage) / 100))
        const calculateTotalSaved = Math.floor(savings.reduce((sum, val) => sum + val, 0)) || 0
        setTotalSaved(calculateTotalSaved);

        // Taking the price of netflix to be 5.99 per month
        setNumMonthsNetflix(Math.floor(calculateTotalSaved / 5.99));

        // taking the price of groceries per week to be 42 pounds per person
        setGroceryWeeks(Math.floor(calculateTotalSaved / 42))

        const dailySavings : Record<string, number> = userTransactions.reduce((sum, t) => {
            if (!t.transactionTimestamp) {
                return sum;
            }
            const date = t.transactionTimestamp.split('T')[0];
            const saving = (t.amountSpent * t.discountPercentage) / 100;
            sum[date] = (sum[date] || 0) + saving;
            return sum;
        }, {});

        const bestDay= Object.entries(dailySavings).reduce((best, candidate) => candidate[1] > best[1] ? candidate : best, ["", 0]);

        setBestDay(new Date(bestDay[0]).toLocaleDateString());

        setBestDayAmount(bestDay[1]);
    }

    calculateSavings()

    return (
        <div>
        <br/>
            <ul>
                <li>You saved £{totalSaved} this year with student discounts! That's like {numMonthsNetflix} months of Netflix! </li>
                <li>Your best shopping day was {bestDay} when you saved £{bestDayAmount} in a single purchase</li>
                <li>You're in the top {userPercentile}% of shoppers among UniDays users</li>
                <li>Your discounts could buy {numGroceryWeeks} weeks of groceries! </li>
            </ul>
        </div>
    );
}


export default Savings;


