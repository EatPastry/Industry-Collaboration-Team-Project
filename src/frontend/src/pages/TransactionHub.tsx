import React, {useEffect, useState} from 'react';
import '../styles/transactionHub.css';
import Calendar from "../components/Calendar";
import categories from "./recappedSubPages/Categories";
import {getSession, pNameToID} from "../services/API";

type priceRange = {
    min : number,
    max : number
}

// The brands available for a user to add to the db and their corresponding category
const brand = [
    // Learning & Earning
    { partnerName: "Coursera", shopCategory: "Learning & Earning" },
    { partnerName: "Udemy", shopCategory: "Learning & Earning" },
    { partnerName: "LinkedIn Learning", shopCategory: "Learning & Earning" },
    { partnerName: "Skillshare", shopCategory: "Learning & Earning" },
    { partnerName: "Duolingo", shopCategory: "Learning & Earning" },

    // Fashion
    { partnerName: "Adidas", shopCategory: "Fashion" },
    { partnerName: "Zara", shopCategory: "Fashion" },
    { partnerName: "H&M", shopCategory: "Fashion" },
    { partnerName: "Uniqlo", shopCategory: "Fashion" },
    { partnerName: "Gucci", shopCategory: "Fashion" },
    { partnerName: "Prada", shopCategory: "Fashion" },

    // Food & Drink
    { partnerName: "Starbucks", shopCategory: "Food & Drink" },
    { partnerName: "McDonald's", shopCategory: "Food & Drink" },
    { partnerName: "Coca-Cola", shopCategory: "Food & Drink" },
    { partnerName: "PepsiCo", shopCategory: "Food & Drink" },
    { partnerName: "Nestlé", shopCategory: "Food & Drink" },
    { partnerName: "Subway", shopCategory: "Food & Drink" },

    // Technology
    { partnerName: "Apple", shopCategory: "Technology" },
    { partnerName: "Microsoft", shopCategory: "Technology" },
    { partnerName: "Google", shopCategory: "Technology" },
    { partnerName: "Samsung", shopCategory: "Technology" },
    { partnerName: "Intel", shopCategory: "Technology" },
    { partnerName: "NVIDIA", shopCategory: "Technology" },

    // Beauty
    { partnerName: "L'Oréal", shopCategory: "Beauty" },
    { partnerName: "Estée Lauder", shopCategory: "Beauty" },
    { partnerName: "MAC Cosmetics", shopCategory: "Beauty" },
    { partnerName: "Sephora", shopCategory: "Beauty" },
    { partnerName: "Maybelline", shopCategory: "Beauty" },
    { partnerName: "Fenty Beauty", shopCategory: "Beauty" },

    // Travel & Lifestyle
    { partnerName: "Airbnb", shopCategory: "Travel & Lifestyle" },
    { partnerName: "Expedia", shopCategory: "Travel & Lifestyle" },
    { partnerName: "Booking.com", shopCategory: "Travel & Lifestyle" },
    { partnerName: "TripAdvisor", shopCategory: "Travel & Lifestyle" },
    { partnerName: "Marriott", shopCategory: "Travel & Lifestyle" },
    { partnerName: "Emirates", shopCategory: "Travel & Lifestyle" },

    // Wellbeing
    { partnerName: "Headspace", shopCategory: "Wellbeing" },
    { partnerName: "Calm", shopCategory: "Wellbeing" },
    { partnerName: "MyFitnessPal", shopCategory: "Wellbeing" },
    { partnerName: "Noom", shopCategory: "Wellbeing" },
    { partnerName: "BetterHelp", shopCategory: "Wellbeing" },
    { partnerName: "Talkspace", shopCategory: "Wellbeing" },

    // Health & Fitness
    { partnerName: "Fitbit", shopCategory: "Health & Fitness" },
    { partnerName: "Peloton", shopCategory: "Health & Fitness" },
    { partnerName: "Nike", shopCategory: "Health & Fitness" },
    { partnerName: "ClassPass", shopCategory: "Health & Fitness" },
    { partnerName: "Under Armour", shopCategory: "Health & Fitness" },
    { partnerName: "Garmin", shopCategory: "Health & Fitness" }
];






function TransactionHub() {
    const [currentCat, setCurrentCat] = useState("Learning & Earning");
    const [basketItems, setBasketItems] = useState([])
    const [dateSelected, setDateSelected] = useState(new Date('2025-01-01'));

    // Returns corresponding colour for given category
    function getCategoryColour(category : string){
        // maps the brand category to colour for that category
        const catToCol : Record<string, string>  = {
            "Learning & Earning": "#4285F4",
            "Fashion": "#EA4335",
            "Food & Drink": "#FBBC05",
            "Technology": "#34A853",
            "Beauty": "#FF6D91",
            "Travel & Lifestyle": "#46BDC6",
            "Wellbeing": "#9C27B0",
            "Health & Fitness": "#FF9800"
        }

        // If no category is found return default colour white
        return catToCol[category] || "FFFFFF";
    }



    // Returns corresponding price range for given category
    function getCategoryPrice(category: string){
        // maps the brand category to the possible price of items within that category
        const catToPrice : Record<string, priceRange> = {
            'Learning & Earning': { min: 10, max: 50 },
            'Fashion': { min: 20, max: 400 },
            'Food & Drink': { min: 5, max: 50 },
            'Technology': { min: 50, max: 3000 },
            'Beauty': { min: 15, max: 300 },
            'Travel & Lifestyle': { min: 50, max: 5000 },
            'Wellbeing': { min: 10, max: 200 },
            'Health & Fitness': { min: 20, max: 500 }
        };

        // If no category is found return default price range
        return catToPrice[category] || {min: 0, max: 10};
    }

    // Returns corresponding discount range for given category
    function getCategoryDiscount(category : string){
        // maps the brand category to the possible discounts for items within that category
        const catToDiscount: Record<string, priceRange> = {
            'Learning & Earning': { min: 5, max: 80 },
            'Fashion': { min: 10, max: 70 },
            'Food & Drink': { min: 5, max: 40 },
            'Technology': { min: 5, max: 30 },
            'Beauty': { min: 10, max: 50 },
            'Travel & Lifestyle': { min: 10, max: 60 },
            'Wellbeing': { min: 10, max: 50 },
            'Health & Fitness': { min: 10, max: 40 }
        };

        // If no category is found return default discount range
        return catToDiscount[category] || {min: 0, max: 10};
    }


    const objBrands = brand.reduce<{[key:string]: string[]}>((sum, current ) =>
    {
        if (!sum[current.shopCategory]){
            sum[current.shopCategory] = []
        }

        sum[current.shopCategory].push(current.partnerName)
        return sum;
    }, {})


    function createRandomPrice(){
        let priceRange : priceRange = getCategoryPrice(currentCat)
        return ((Math.random() * (priceRange.max - priceRange.min)) + priceRange.min).toFixed(2)
    }

    function changeDate(date : Date){
        setDateSelected(date)

    }

    async function fillBasket(partnerName : string, price : number){
        const discountRange = getCategoryDiscount(partnerName)
        const discountPercent : number =   ((Math.random() * (discountRange.max - discountRange.min)) + discountRange.min)
        const finalPrice : number = parseFloat((price * ( 1 - (discountPercent/100))).toFixed(2))

        const parnerID = await pNameToID(partnerName)
        const session = await getSession()

        if (!session){
            throw new Error("Session for current user not found")
        }
        const userID = session.user.id;

        if (parnerID == null){
            throw new Error("No Corresponding Partner ID for given partner Name");
        }


        const item = {


        }

        // setBasketItems([...basketItems, item])
    }

    return (
        <div className='TransactionHub'>
            <div id='title'>
                <h1>Transaction Hub</h1>
                <p>Add transactions to view your Recapped!</p>
            </div>

            <div id="randomTransaction">

                <button>Add a random transaction</button>
            </div>

            <h2>or</h2>

            <div id="chooseDate">
                <h3>1. Choose a Date</h3>
                <div id='Calendar'>
                    <Calendar onChange={changeDate}/>
                </div>
            </div>
            <div id="chooseProduct">
                <h3>2. Choose a Product</h3>


                <div id="themeContainer">
                    {Object.keys(objBrands).map(category => (
                        <button id="themeButton" onClick={() => setCurrentCat(category)}
                                style={{color: getCategoryColour(category)}}>{category}</button>
                    ))}
                </div>

                {objBrands[currentCat].map(partnerName => {
                    const priceOptions = Array.from({length: 3}, () => createRandomPrice())
                    return (
                        <div id='partnerCard'>
                            {partnerName}
                            <div id='partnerPrices'>

                                {priceOptions.map((price, current) => (
                                    <button onClick={() => fillBasket(partnerName, parseFloat(price))}>{price}</button>
                                ))}
                            </div>
                        </div>
                    )
                })}
            </div>

            <div id = 'basket'>
            <h2>Your Basket</h2>


            <button>Buy All</button>
            </div>
        </div>
    )
}

export default TransactionHub;