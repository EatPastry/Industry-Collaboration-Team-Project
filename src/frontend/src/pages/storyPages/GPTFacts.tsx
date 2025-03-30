import React, {useEffect, useState} from 'react';
import {getCurrentUserTransactions, getPartnerIds} from '../../services/API'
import { openai } from "../../utils/openai";
import TypeIt from 'typeit-react';

/**
 * Returns a fun summary about the user's spending to the user
 * @constructor
 */
function GPTFacts () {

    // Constant used for return value
    const [aiMessage, setAiMessage] = useState("Loading insights...");

    const generateAiMessage = async () => {
        try {
            // Grab and error check user's transactions
            const transactions = await getCurrentUserTransactions();
            if (!transactions) {
                console.error("Error fetching transactions:");
                setAiMessage("Could not retrieve transactions.");
                return;
            }

            // Map a list of partnerIDs from the userTransactions
            const partnerIDs = transactions.map((t) => t.partnerID);
            // Fetch a Partner for each PartnerID
            const partnerData = await getPartnerIds(partnerIDs)
            // Error check
            if (!partnerData) {
                console.error("Error fetching partner details:");
                setAiMessage("Could not retrieve partner details.");
                return;
            }

            // Enrich transactions based on their partners and categories
            const enrichedTransactions = transactions.map((t) => {
                const partner = partnerData.find((p: { partnerID: any; }) => p.partnerID === t.partnerID);
                return {
                    amountSpent: t.amountSpent,
                    partnerName: partner ? partner.partnerName : "Unknown Partner",
                    category: partner ? partner.shopCategory : "Unknown Category",
                };
            });

            // Create a summary of users spending that can be submitted to ChatGPT
            const spendingSummary = enrichedTransactions
                .map((t) => `Spent $${t.amountSpent} at ${t.partnerName} (${t.category}).`)
                .join(" ");

            // Prompt to be submitted to ChatGPT
            const prompt = `Generate an interesting and personalized message based on this user's spending habits: ${spendingSummary}`;

            // Log request
            console.log("Request made to chat-gpt");
            const completion = await openai.chat.completions.create({
                model: "gpt-4o-mini", // Model selection
                messages: [
                    { role: "system", content: // "system" message is passed with every request, instructing the agent on how to act/respond
                            "You are writing a creative response to a user that summarizes their spending habits. " +
                            "Try to come up with quirky names for the user such as techy-trendsetter etc. " +
                            "Incorporate stats about their spending into your response e.g. \`You saved £850, thats enough to buy a new iPhone!\'" +
                            "Limit your response to 150 words."},
                    {
                        role: "user", // "user" message is what the model actually responds to based on its instructions and the unique prompt
                        content: prompt,
                    },
                ],
                temperature: 0.7, // Creativity level
            });

            // Constant for ChatGPT response
            const response = completion.choices[0].message;
            // Error check
            if (!response) {
                setAiMessage("No insights available.");
                return;
            } else {
                // @ts-ignore
                setAiMessage(response.content.trim())
            }

        } catch (error) {
            console.error("Unexpected error in generateSpendingInsights:", error);
            setAiMessage("An error occurred while generating insights.");
        }
    }

    useEffect(() => {generateAiMessage().then()}, []);

    return (
        <div>
            <header><TypeIt key={aiMessage} options={{cursor: true, speed: 50}}></TypeIt></header>
        </div>
    );
}

export default GPTFacts;
