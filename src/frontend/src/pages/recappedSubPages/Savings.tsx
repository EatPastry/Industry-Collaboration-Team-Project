import React, {useEffect, useState} from 'react';
import {supabase} from "../../utils/supabase";
import {createJsWithBabelEsmLegacyPreset} from "ts-jest";



function Savings(){
    const [totalSaved, setTotalSaved] = useState<number | null>(null);
    const [numMonthsNetflix, setNumMonthsNetflix] = useState<number | null>(null);
    const [bestDay, setBestDay] = useState<string | null>(null);
    const [bestDayAmount, setBestDayAmount] = useState<number | null>(null);
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

            if(!sum[date]){
                sum[date] = saving;
            }else{
                sum[date] += saving;
            }
            return sum;
        }, {});

        const bestDay= Object.entries(dailySavings).reduce((best, candidate) => candidate[1] > best[1] ? candidate : best, ["", 0]);

        setBestDay(new Date(bestDay[0]).toLocaleDateString());

        setBestDayAmount(bestDay[1]);
    }

    calculateSavings()

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


