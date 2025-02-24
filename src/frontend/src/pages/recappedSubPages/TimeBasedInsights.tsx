import React, {useEffect, useState} from 'react';
import {supabase} from "../../utils/supabase";

/**
 * Returns time based insights for the current signed-in User
 */
function TimeBasedInsights(){
    const [summerSaving, setSummerSaving] = useState(0);

    const [firstPurchaseName, setFirstPurchaseName] = useState("");
    const [firstPurchaseDate, setFirstPurchaseDate] = useState('');
    const [firstPurchasePrice, setFirstPurchasePrice] = useState(0);

    const [latestPurchaseName, setLatestPurchaseName] = useState('');
    const [latestPurchaseDate, setLatestPurchaseDate] = useState('');
    const [latestPurchasePrice, setLatestPurchasePrice] = useState(0);



    async function calculateTimeInsights(){
        const {data: {session}} = await supabase.auth.getSession();
        if (!session || !session.user) {
            return;
        }

        const userID = session.user.id;

        // Select all transactions of the current signed-in user
        const {data: userTransactions} = await supabase
            .from("Transactions")
            .select("*")
            .eq("userID", userID)

        if (userTransactions == null) {
            console.error("Error fetching user transactions");
            return;
        }

        // sort transactions by date
        userTransactions.sort((x, y) => {
            const xDate = new Date(x.transactionDate);
            const yDate = new Date(y.transactionDate);
            return xDate.getTime() - yDate.getTime();
        });

        //Calculate users summer savings - summer taken to be June-August
        const summerSaving = userTransactions.reduce((sum, t) => {
            if (!t.transactionTimestamp) {
                return sum;
            }
            // Obtain the month of each transaction t
            const tMonth = (new Date(t.transactionTimestamp)).getMonth()
            const savings = ((t.amountSpent * t.discountPercentage) / 100) || 0 // 0 if no savings exist

            // Between June and August
            if (tMonth <= 7 && tMonth >= 5) {
                return sum + savings
            }
            return sum
        }, 0)

        if (summerSaving){
            // Sets the summer saving value to 2 dp
            setSummerSaving(summerSaving.toFixed(2))
        }

        // takes the first and last purchase from first/last index of userTransactions
        const firstPurchase = userTransactions[0];
        const latestPurchase = userTransactions[userTransactions.length - 1];

        if (firstPurchase && latestPurchase) {
            if (firstPurchase.transactionTimestamp){
                setFirstPurchaseDate(new Date(firstPurchase.transactionTimestamp).toLocaleDateString());
            }
            // Calculate the first price the student paid
            const firstPrice = firstPurchase.amountSpent - ((firstPurchase.amountSpent * firstPurchase.discountPercentage)/100)
            setFirstPurchasePrice(Number(firstPrice.toFixed(2)));

            // Search through the Partner Table for the partner Name for the first Purchase
            if (firstPurchase.partnerID){
                const {data : firstPartner} =
                    await supabase.from("Partner")
                        .select("partnerName")
                        .eq("partnerID", firstPurchase.partnerID).single()

                    if (firstPartner){
                        setFirstPurchaseName(firstPartner.partnerName);
                    }
            }

            if (latestPurchase.transactionTimestamp){
                setLatestPurchaseDate(new Date(latestPurchase.transactionTimestamp).toLocaleDateString());
            }

            // Calculate the latest price the student paid
            const latestPrice = latestPurchase.amountSpent - ((latestPurchase.amountSpent * latestPurchase.discountPercentage)/100)
            setLatestPurchasePrice(Number(latestPrice.toFixed(2)));

            // Search through the Partner Table for the partner Name for the Latest Purchase
            if (latestPurchase.partnerID){
                const {data : latestPartner} =
                    await supabase.from("Partner")
                        .select("partnerName")
                        .eq("partnerID", latestPurchase.partnerID).single()

                if (latestPartner){
                    setLatestPurchaseName(latestPartner.partnerName);
                }
            }
        }

    }

    // So that it only runs when a change occurs and not every rerender
    calculateTimeInsights()


    return (
        <div>
            <br/>
            <header>
                <ul>
                    <li>Your Summer Shopping Spree saved you £{summerSaving}</li>
                    <li>You've come a long way!
                        <br/>
                        From Your
                        <br/>
                         First purchase: {firstPurchaseName} on {firstPurchaseDate} at £{firstPurchasePrice}

                        <br/>
                        To Your <br/>
                        Latest purchase: {latestPurchaseName} on {latestPurchaseDate} at £{latestPurchasePrice}
                    </li>
                </ul>
            </header>
        </div>
    );
}


export default TimeBasedInsights;


