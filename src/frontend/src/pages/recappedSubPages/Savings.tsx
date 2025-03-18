import React, {useEffect, useState} from 'react';
import {getCurrentUserTransactions} from "../../services/API";
import { AnimatedCounter } from 'react-animated-counter';
import SlotCounter from 'react-slot-counter';
/**
 * Returns Savings based metrics for the current signed-in User
 */
function Savings(){
    const [finalSaved, setFinalSaved] = useState(0);
    const [totalSaved, setTotalSaved] = useState<number | null>(null);
    const [numMonthsNetflix, setNumMonthsNetflix] = useState<number | null>(null);
    const [bestDay, setBestDay] = useState<string | null>(null);
    const [bestDayAmount, setBestDayAmount] = useState<number | null>(null);
    const [numGroceryWeeks, setGroceryWeeks] = useState<number | null>(null);
    let savedVal = 0;

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

        setTimeout(() => {
            setFinalSaved(totalSaved!);
        }, 2000);

    }

    // So that it only runs when a change occurs and not every rerender
    useEffect(() => {
        calculateSavings()
    },[]);

    function getFormattedString() {
        let x = totalSaved!.toString();
        var pattern = /(-?\d+)(\d{3})/;
        while (pattern.test(x))
            x = x.replace(pattern, "$1,$2");
        return x + ".00";
    }

    return (
        <div className="fullscreen savings-screen">
            <div style={{paddingTop: "35vh", fontSize: "28px", color: "white"}}>
                You saved 
                <br></br>
                <div style={{display: "flex", justifyContent: "center", alignItems: "center", fontSize: "72px"}}>
                    £{totalSaved !== null && <SlotCounter value={getFormattedString()} duration={4} />}
                </div>
                <br></br>this year with student discounts! That's like {numMonthsNetflix} months of Netflix!
            </div>
            
        </div>
    );
}

//<li>Your best shopping day was {bestDay} when you saved £{bestDayAmount} in a single purchase</li>
//<li>Your discounts could buy {numGroceryWeeks} weeks of groceries!</li>
export default Savings;


