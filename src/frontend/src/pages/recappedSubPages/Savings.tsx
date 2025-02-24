import React, {useEffect, useState} from 'react';
import {getCurrentUserTransactions} from "../../services/API";


/**
 * Returns Savings based metrics for the current signed-in User
 */
function Savings(){
    const [totalSaved, setTotalSaved] = useState<number | null>(null);
    const [numMonthsNetflix, setNumMonthsNetflix] = useState<number | null>(null);
    const [bestDay, setBestDay] = useState<string | null>(null);
    const [bestDayAmount, setBestDayAmount] = useState<number | null>(null);
    const [numGroceryWeeks, setGroceryWeeks] = useState<number | null>(null);

    async function calculateSavings(): Promise<void> {
        const userTransactions = await getCurrentUserTransactions();
        if (!userTransactions){
            return;
        }

        // Calculate the Saving for each transaction for the current signed-in user, then Sum these Savings
        const savings = userTransactions.map(t => ((t.amountSpent * t.discountPercentage) / 100))
        const calculateTotalSaved = Math.floor(savings.reduce((sum, val) => sum + val, 0)) || 0
        setTotalSaved(calculateTotalSaved);

        // Taking the price of netflix to be 5.99 per month
        setNumMonthsNetflix(Math.floor(calculateTotalSaved / 5.99));

        // taking the price of groceries per week to be 42 pounds per person
        setGroceryWeeks(Math.floor(calculateTotalSaved / 42))


        // Calculate the savings for each day for the current user
        const dailySavings : Record<string, number> = userTransactions.reduce((sum, t) => {
            if (!t.transactionTimestamp) {
                return sum;
            }
            const date = t.transactionTimestamp.split('T')[0];
            const saving = (t.amountSpent * t.discountPercentage) / 100;

            if(!sum[date]){
                sum[date] = saving;
            }else{
                sum[date] += saving;
            }
            return sum;
        }, {});


        // Of the daily savings calculate the highest saving
        const bestDay= Object.entries(dailySavings)
            .reduce((best, candidate) => candidate[1] > best[1] ? candidate : best, ["", 0]);

        // Get the date of the highest saving from index 0 of bestDay
        setBestDay(new Date(bestDay[0]).toLocaleDateString());

        // Get the Price of the highest saving from index 1 of bestDay
        setBestDayAmount(bestDay[1]);
    }

    // So that it only runs when a change occurs and not every rerender
    useEffect(() => {
        calculateSavings()
    },[]);

    return (
        <div className={"container"}>
            <br/>
            <header>
                <ul>
                    <li>You saved £{totalSaved} this year with student discounts! That's like {numMonthsNetflix} months
                        of Netflix!
                    </li>
                    <li>Your best shopping day was {bestDay} when you saved £{bestDayAmount} in a single purchase</li>
                    <li>Your discounts could buy {numGroceryWeeks} weeks of groceries!</li>
                </ul>
            </header>
        </div>
    );
}


export default Savings;


