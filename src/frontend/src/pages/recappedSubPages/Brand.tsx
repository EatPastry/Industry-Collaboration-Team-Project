import React, {useEffect, useState} from 'react';
import {supabase} from "../../utils/supabase";


/**
 * Returns brand statistics for the current signed-in User
 */
function Brand() {

    // modeBrand variable used for most commonly shopped category e.g. Starbucks or Nike
    const [modeBrand, setModeBrand] = useState("");


    // Function to calculate and set category variables
    async function calculateBrands(): Promise<void> {

        // getSession from supabase
        const {data: {session}} = await supabase.auth.getSession();
        if (!session || !session.user) {
            return;
        }
        // Assign userID variable for transaction search
        const userID = session.user.id;

        // Pull all transactions associated with a given user
        const {data: userTransactions} = await supabase
            .from("Transactions")
            .select("*")
            .eq("userID", userID)

        // Error check transaction pull
        if (userTransactions == null) {
            console.error("Error fetching user transactions");
            return;
        }

        // Map a list of partnerIDs from the userTransactions
        const partnerIDs = userTransactions.map((t) => t.partnerID);

        // Pull the partnerData for each partnerID
        const { data: partnerData, error: partnerError } = await supabase
            .from("Partner")
            .select("partnerID, partnerName")
            .in("partnerID", partnerIDs);
        // Error check the partnerData
        if (partnerError || !partnerData) {
            console.error("Error fetching partner categories:", partnerError?.message);
            return;
        }

        // Create and initialise a record of categories and their respective counts (number of transactions)
        const brandCounts: Record<string, number> = {};
        for (const partner of partnerData) {
            const brand = partner.partnerName;
            brandCounts[brand] = (brandCounts[brand] || 0) + 1;
        }

        // Initialise counting variables
        let maxCount = 0;
        // Search the record to find the most commonly shopped category
        for (const [brand, count] of Object.entries(brandCounts)) {
            if (count > maxCount) {
                setModeBrand(brand)
                maxCount = count;
            }
        }
    }

    // So that it only runs when a change occurs and not every rerender
    useEffect(() => {
        calculateBrands()
    },[]);


    return (
        <div>
            <br/>
            <header>
                Your favorite brand was {modeBrand}!
            </header>
        </div>
    );
}

export default Brand;


