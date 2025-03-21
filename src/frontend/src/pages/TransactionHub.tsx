import React, {useEffect, useState} from 'react';
import '../styles/transactionHub.css';
import Calendar from "../components/Calendar";
import {getSession, pNameToID} from "../services/API";
import {supabase} from "../utils/supabase";
import {clearCookie, parseToken} from "../services/Authentication";
import {NavigateFunction, useLocation, useNavigate} from "react-router-dom";



/**
 * Checks every 3 seconds that the session is still active <br>
 * if the session is stale it logs the user out by clearing cookies
 *
 * @param navigation of useNavigate() to navigate to Log in (/) page
 */
export function checkSession(navigation : NavigateFunction){
    return setInterval(async () => {
        let { error} = await supabase.auth.getUser();
        if (error) {
            clearCookie(parseToken());
            navigation(`/`);
        }
    }, 3000)
}


/*
 Create type for the range of prices/discounts for brand categories
 */
type priceRange = {
    min : number,
    max : number
}

// Interface for the data stored for each item added to the basket
interface BasketItem {
    partnerID : string;
    partnerName : string;
    price: number;
    amountSpent: number;
    discountPercentage: number;
    transactionTimestamp: string;
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


/**
 * Generates a page where users can add data to their accounts
 */
function TransactionHub() {
    const navigation = useNavigate();
    const location = useLocation();
    const [currentCat, setCurrentCat] = useState("Learning & Earning");
    // Stores a list of all items added to the basket
    const [basketItems, setBasketItems] = useState<BasketItem[]>([])
    const [dateSelected, setDateSelected] = useState(new Date('2025-01-01'));

    useEffect(() => {
        // Log user out if without session
        const hasSession = checkSession(navigation)
        return () => {
            clearInterval(hasSession)
        };
    }, [location.pathname, navigation]);

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

    // Creates an object that organises the brands by their respective categories
    const brandsByCategory = brand.reduce<{[key:string]: string[]}>((sum, current ) =>
    {
        // Establish empty list for a category if one doesnt already exist (on first loop)
        if (!sum[current.shopCategory]){
            sum[current.shopCategory] = []
        }
        // Add the current brandName to its categories array
        sum[current.shopCategory].push(current.partnerName)
        return sum;
    }, {})

    // generates a random price for the current category
    function createRandomPrice(){
        // Gets the min and max price values for the category
        let priceRange : priceRange = getCategoryPrice(currentCat)
        // returns a random value between the min and max values for the category
        return ((Math.random() * (priceRange.max - priceRange.min)) + priceRange.min).toFixed(2)
    }

    // Sets the current Date state
    function changeDate(date : Date){
        setDateSelected(date)
    }

    // Fills the item basket by adding to basketItems
    async function fillBasket(partnerName : string, price : number, date : Date){
        // Gets the min and max discount values for the category
        const discountRange = getCategoryDiscount(currentCat)
        // generate a random value between the min and max discount values for the category
        const discountPercent : number =   ((Math.random() * (discountRange.max - discountRange.min)) + discountRange.min)
        // calculate the price of the item after the discount has been applied to it
        const finalPrice : number = parseFloat((price * ( 1 - (discountPercent/100))).toFixed(2))

        // Get the partnerID from the partnerName
        const partnerID = await pNameToID(partnerName)
        if (partnerID == null){
            throw new Error("No Corresponding Partner ID for given partner Name");
        }

        // creates a new item with the transaction details
        const item = {
            partnerID : partnerID,
            partnerName: partnerName,
            price: price, // original price before applying the discount
            amountSpent : finalPrice, // price after applying the discount
            discountPercentage : discountPercent,
            transactionTimestamp : date.toISOString()
        }
        // Add the new item to the basket basketItems
        setBasketItems([...basketItems, item])
    }

    // Adds a random transaction to the basket basketItems
    async function addRandomTransaction(){
        // generate a random random from brand
        const randBrand = brand[Math.floor(Math.random() * brand.length)];

        const randPartner = randBrand.partnerName
        const randCat = randBrand.shopCategory;

        // store the user selected category so that we can restore it after setting the currentCurrentCat to randCat
        const tempCat = currentCat;

        setCurrentCat(randCat)

        // generate a random price for the given category
        const randPrice = createRandomPrice()

        // store the user selected date so that we can restore it after setting setDateSelected to randDate
        const tempDate = dateSelected;

        // generate a random date within 2025
        const startDate = new Date('2025-01-01T00:00:00Z').getTime();
        const endDate = new Date('2025-12-31T23:59:59Z').getTime();
        const randDate = new Date(Math.floor(Math.random() * (endDate - startDate + 1)) + startDate)

        setDateSelected(randDate)

        // fill the basket with an item of random values generated
        await fillBasket(randPartner, parseFloat(randPrice), randDate)

        setDateSelected(tempDate)
        setCurrentCat(tempCat)
    }

    async function buyAllHandler(){
        // get session for current logged in user
        const session = await getSession()

        if (!session){
            throw new Error("Session for current user not found")
        }
        // get userID for the current logged in user from the session
        const userID = session.user.id;

        // create a list of transactions from the items in basketItems
        const allTransactions = basketItems.map(item => ({
            userID : userID,
            partnerID : item.partnerID,
            amountSpent : item.amountSpent,
            discountPercentage : item.discountPercentage,
            transactionTimestamp : item.transactionTimestamp,
        }));

        // Push the list of transaction to the db
        const {error} = await supabase.from('Transactions').insert(allTransactions)
        if (error){
            console.error(error)
            return;
        }

        // Remove the items from the basket
        clearBasket()
    }

    // removes all items in basketItems
    function clearBasket(){
        setBasketItems([])
    }


    return (
        <div className='TransactionHub'>
            {/*generate a title for the transaction Hub*/}
            <div id='title'>
                <h1>Transaction Hub</h1>
                <p>Add transactions to view your Recapped!</p>
            </div>

            {/*Add a button to add random transactions, and a counter for the items in the basket*/}
            <div id="randomTransaction">
                <button onClick={() => addRandomTransaction()}>Add a random transaction</button>
                <span id="itemsData">Items : {basketItems.length}</span>
            </div>

            <h2>or</h2>

            {/*Display a calendar using the Calendar component so users can select the date of purchase*/}
            <div id="chooseDate">
                <h3>1. Choose a Date</h3>
                <div id='Calendar'>
                    <Calendar onChange={changeDate}/>
                </div>
            </div>
            <div id="chooseProduct">
                <h3>2. Choose a Product</h3>
                {/*Displays a list of buttons that correspond to the brand categories*/}
                <div id="themeContainer">
                    {Object.keys(brandsByCategory).map(category => (
                        <button id="themeButton" onClick={() => setCurrentCat(category)}
                                style={{color: getCategoryColour(category)}}>{category}</button>
                    ))}
                </div>
                {/*Display a list of brands that are within the current clicked brand category button*/}
                <div className={ "partnerWrapper"}>
                {brandsByCategory[currentCat].map(partnerName => {
                    // generate buttons with 3 random prices for each brand
                    const priceOptions = Array.from({length: 3}, () => createRandomPrice())
                    return (
                        <div id='partnerCard'>
                            {partnerName}
                            <div id='partnerPrices'>
                                {/*fill the basket when price button is clicked*/}
                                {priceOptions.map((price) => (
                                    <button onClick={() => fillBasket(partnerName, parseFloat(price), dateSelected)}>{price}</button>
                                ))}
                            </div>
                        </div>
                    )
                })}
            </div>
            </div>

            <div id='basket'>
                <h2>Your Basket</h2>

                <div id='basketCardWrapper'>
                    {/*Create a list of cards for each item in the basket*/}
                    {basketItems.map((item) => (
                        <div id='basketCard'>
                            {/*List name, price, discount, and date data on each item card*/}
                            <h3>{item.partnerName}</h3>
                            <p><strong>Original Price:</strong> £{item.price.toFixed(2)}</p>
                            <p><strong>Amount
                                Spent:</strong> £{item.amountSpent.toFixed(2)} ({item.discountPercentage.toFixed(1)}%
                                off)
                            </p>
                            <p><strong>Date:</strong> {new Date(item.transactionTimestamp).toLocaleDateString()}</p>
                        </div>
                    ))}
                </div>
                <br/>
                <span id="itemsData">Items : {basketItems.length}</span>
                <br/>

                {/*add buttons to buy all items in the basket or clear all items in the basket without pushing to the database*/}
                <button id='buyAllButton' onClick={buyAllHandler}>Buy All</button>
                <button id='clearAllButton' onClick={clearBasket}>Clear All</button>
            </div>
        </div>
    )
}

export default TransactionHub;