import React, {useEffect, useState} from 'react';
// import {supabase} from "../../utils/supabase";
import {getCurrentUserTransactions, getPartnerIds} from '../../services/API'


/**
 * Returns category statistics for the current signed-in user
 */
function Categories(){

    // modeCategory variable used for most commonly shopped category e.g. Fashion or Technology
    const [modeCategory, setModeCategory] = useState("");

    // Function to calculate and set category variables
    async function calculateCategories(): Promise<void> {

        const userTransactions = await getCurrentUserTransactions();
        if (!userTransactions){
            return;
        }

        // Map a list of partnerIDs from the userTransactions
        const partnerIDs = userTransactions.map((t) => t.partnerID);

        // Fetch Partner for PartnerID
        const partnerData = await getPartnerIds(partnerIDs)
        if (!partnerData) {
            return;
        }

        // Create and initialise a record of categories and their respective counts (number of transactions)
        const categoryCounts: Record<string, number> = {};
        for (const partner of partnerData) {
            const category = partner.shopCategory;
            categoryCounts[category] = (categoryCounts[category] || 0) + 1;
        }

        // Initialise counting variable
        let maxCount = 0;
        // Search the record to find the most commonly shopped category
        for (const [category, count] of Object.entries(categoryCounts)) {
            if (count > maxCount) {
                setModeCategory(category)
                maxCount = count;
            }
        }
    }

    // So that it only runs when a change occurs and not every rerender
    useEffect(() => {
        calculateCategories()
    },[]);


    // Return message
    return (
        <div>
            <br/>
            <header>
             You love to shop in {modeCategory}!
            </header>
        </div>
    );
}


export default Categories;


