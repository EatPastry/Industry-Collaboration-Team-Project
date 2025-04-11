import React, { useEffect, useState } from "react";
import { getCurrentUserTransactions, getPartnerIds } from "../../services/API";
import TypeIt from "typeit-react";
// import {supabase} from "../../utils/supabase";
import BrandsTorusDisplay from "../../components/BrandTorusDisplay";


/**
 * Returns brand statistics for the current signed-in User
 */
function Brand() {
    const [modeBrand, setModeBrand] = useState("");

    async function calculateBrands(): Promise<void> {
        const userTransactions = await getCurrentUserTransactions();
        if (!userTransactions) {
            return;
        }

        const partnerIDs = userTransactions.map((t) => t.partnerID);
        const partnerData = await getPartnerIds(partnerIDs);
        if (!partnerData) {
            return;
        }

        const brandCounts: Record<string, number> = {};
        for (const partner of partnerData) {
            const brand = partner.partnerName;
            brandCounts[brand] = (brandCounts[brand] || 0) + 1;
        }

        let maxCount = 0;
        let mostPopularBrand = "";
        for (const [brand, count] of Object.entries(brandCounts)) {
            if (count > maxCount) {
                mostPopularBrand = brand;
                maxCount = count;
            }
        }

        setModeBrand(mostPopularBrand);
    }

    useEffect(() => {
        calculateBrands()
    },[]);
    
    return (
        <div className="fullscreen brand-screen">
            <div style={{ paddingTop: "6vh", fontSize: "24px", color: "white" }}>
                
                <br />
                <div style={{ 
                    display: "flex", 
                    justifyContent: "center", 
                    alignItems: "center", 
                    fontSize: "50px",
                    fontWeight: "bold",
                    marginTop: "0px"
                }}>
            
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
