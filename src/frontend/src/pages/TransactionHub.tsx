import React from 'react';
import '../styles/transactionHub.css';
import Calendar from "../components/Calendar";

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

    function getCategoryColour(category : string){
        let catToCol : Record<string, string>  = {
            "Learning & Earning": "#4285F4",
            "Fashion": "#EA4335",
            "Food & Drink": "#FBBC05",
            "Technology": "#34A853",
            "Beauty": "#FF6D91",
            "Travel & Lifestyle": "#46BDC6",
            "Wellbeing": "#9C27B0",
            "Health & Fitness": "#FF9800"
        }

        return catToCol[category] || "FFFFFF";
    }



    return (
        <div className='transactionHub'>
            <h2>Choose a Date</h2>
            <div id='Calendar'>
                <Calendar />
            </div>

            <h2>Choose a Company</h2>
        </div>
    )
}

export default TransactionHub;