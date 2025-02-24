import React, {useState} from 'react';
import {supabase} from "../../utils/supabase";



function Categories(){

    // modeCategory variable used for most commonly shopped category e.g. Fashion or Technology
    const [modeCategory, setModeCategory] = useState("");

    // Function to calculate and set category variables
    async function calculateCategories(): Promise<void> {

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
            .select("partnerID, shopCategory")
            .in("partnerID", partnerIDs);
        // Error check the partnerData
        if (partnerError || !partnerData) {
            console.error("Error fetching partner categories:", partnerError?.message);
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

    calculateCategories();

    // Return message
    return (
        <div>You love to shop in {modeCategory}!</div>
    );


// * "You're a Fashion Fanatic! {X}% of your shopping was in fashion"
//     * "Tech Trendsetter: You spent more on tech than {X}% of students"
//     * "Beauty Buff: You tried {X} different beauty brands this year"
//     * "Foodie Alert: You ordered enough to feed a small army - {X} food orders!"
//
//     return (
//         <div>
//             <br/>
//             <text>You saved £{totalSaved} this year with student discounts! That's like {numMonths} months of Netflix! </text>
//             <text>Your best shopping day was {shoppingDate} when you saved £{savingAmount} in a single purchase"</text>
//             <text>You're in the top {userPercentile}% of savvy shoppers among UniDays users </text>
//             <text>Your discounts could buy {numWeeks} weeks of groceries! </text>
//         </div>
//     );
}


export default Categories;


