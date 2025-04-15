import React, { useEffect, useState } from 'react';
import ImageBox from './ImageBox';
import {getAllPartners, getCurrentUserTransactions} from "../services/API";

interface Transaction {
  partnerID: string;
  amountSpent: number;
  discountPercentage: number;
}

interface Partner {
  partnerID: string;
  partnerName: string;
}

function Board() {
  const [partnerMapping, setPartnerMapping] = useState<Record<string, string>>({});
  const [totalAmountArray, setTotalAmountArray] = useState<number[]>([]);
  const [totalSavingsArray, setTotalSavingsArray] = useState<number[]>([]);
  const [brandArray, setBrandArray] = useState<string[]>([]);

  //creates an object that stores parnterID and partnerName in a key value pair
  const fetchPartnerMapping = async () => {
    try {
      const allPartners = await getAllPartners()
      const mapping: Record<string, string> = {};

      allPartners.forEach((partners) => {
        mapping[partners.partnerID] = partners.partnerName;
      });

      setPartnerMapping(mapping);

    } catch (err) {
      console.error('Error fetching partners:', (err as Error).message);
    }
  };

  async function highestsBrand() {
    const userTransactions: Transaction[] | null = await getCurrentUserTransactions();
    if (!userTransactions) {
      return;
    }
    //create objects to store the total amount spent and total savings for each brand
    const brandTotals: Record<string, number> = {};
    const brandSavings: Record<string, number> = {};

    //calculate the total amount spent and total savings for each brand
    userTransactions.forEach((t: Transaction) => {
      const partnerID = t.partnerID;
      const savings = Math.round(t.amountSpent * (t.discountPercentage / 100) * 100) / 100;
      
      if (!brandTotals[partnerID]) {
        brandTotals[partnerID] = 0;
        brandSavings[partnerID] = 0;
      }
      brandTotals[partnerID] += t.amountSpent;
      brandSavings[partnerID] += savings;
    });

    //turns soretedBrands record into a 2d array then sorts the brands by total amount spent
    const sortedBrands = Object.entries(brandTotals).sort(
      (a, b) => b[1] - a[1]
    );

    const sortedBrandNames = sortedBrands.map(
      ([partnerID]) => partnerMapping[partnerID]
    );
    const sortedAmounts = sortedBrands.map(([_, amount]) => Math.round(amount * 100) / 100);
    const sortedSavings = sortedBrands.map(([partnerID]) => Math.round(brandSavings[partnerID] * 100) / 100);

    setBrandArray(sortedBrandNames);
    setTotalAmountArray(sortedAmounts);
    setTotalSavingsArray(sortedSavings);
  }

   //Update the variables
   useEffect(() => {
    const fetchData = async () => {
      await fetchPartnerMapping();
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (Object.keys(partnerMapping).length > 0) {
      highestsBrand();
    }
  }, [partnerMapping]);

  return (
    <div className="boardContainer">
    <h1 style={{ marginLeft:"60px", }}>Top Brands</h1>
    
    {[0, 1, 2, 3].map((index) => (
      <div key={index} className="brandRow">
         <div className= "brandNumber">{index + 1}.</div>
        <ImageBox brand={brandArray[index]} />
        <div className="brandDetails">
          <div className="brandBrand">{brandArray[index]}</div>
          <div className="brandText">Total spent: £{totalAmountArray[index]}</div>
          <div className="brandText">Savings: £{totalSavingsArray[index]}</div>
        </div>
      </div>
    ))}
  </div>
);
}

export default Board;
