import React, {useEffect, useState} from 'react';
// import {supabase} from "../../utils/supabase";
import {getCurrentUserTransactions, getPartnerIds} from "../../services/API";
import BrandsTorusDisplay from "../../components/BrandTorusDisplay";


/**
 * Returns brand statistics for the current signed-in User
 */
function Brand() {

    // modeBrand variable used for most commonly shopped category e.g. Starbucks or Nike
    const [modeBrand, setModeBrand] = useState("");


    // Function to calculate and set category variables
    async function calculateBrands(): Promise<void> {
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
        <div className="fullscreen brand-screen">
            <div style={{ paddingTop: "6vh", fontSize: "24px", color: "white" }}>
                Your most commonly shopped brand was
                <br />
                <div style={{ 
                    display: "flex", 
                    justifyContent: "center", 
                    alignItems: "center", 
                    fontSize: "50px",
                    fontWeight: "bold",
                    marginTop: "10px"
                }}>
                    {modeBrand}
                </div>
                <br />
                Here's a look at how much you saved with your top brands:
            </div>
    
            <div style={{ paddingTop: "4px" }}>
                <BrandsTorusDisplay />
            </div>
        </div>
    );
}
    

export default Brand;


