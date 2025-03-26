import React, { useEffect, useState } from "react";
import { getCurrentUserTransactions, getPartnerIds } from "../../services/API";
import TypeIt from "typeit-react";

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
        calculateBrands();
    }, []);

    return (
        <div>
            <br />
            <header>
                {modeBrand ? (
                    <TypeIt options={{ speed: 20, cursor: true }}>
                        {`Your favorite brand was ${modeBrand}!`}
                    </TypeIt>
                ) : (
                    "Loading brand insights..."
                )}
            </header>
        </div>
    );
}

export default Brand;
