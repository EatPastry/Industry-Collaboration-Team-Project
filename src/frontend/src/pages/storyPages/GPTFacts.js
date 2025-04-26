"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importStar(require("react"));
const API_1 = require("../../services/API");
const openai_1 = require("../../utils/openai");

// Typewriter logic
const TypewriterEffect = ({ text, speed = 50 }) => {
    const [displayText, setDisplayText] = (0, react_1.useState)('');
    const [isComplete, setIsComplete] = (0, react_1.useState)(false);

    (0, react_1.useEffect)(() => {
        setDisplayText('');
        setIsComplete(false);

        if (!text) {
            setIsComplete(true);
            return;
        }

        // Ensure text is a string and clean it
        let safeText = String(text).trim();
        if (safeText.endsWith("undefined")) {
            safeText = safeText.slice(0, -9); // remove trailing "undefined"
        }

        let currentIndex = 0;
        setDisplayText(safeText[0] || ''); // set first character

        const typeNextCharacter = () => {
            currentIndex++;
            if (currentIndex < safeText.length) {
                setDisplayText(prev => prev + safeText[currentIndex]);
                setTimeout(typeNextCharacter, speed);
            } else {
                setIsComplete(true);
            }
        };

        setTimeout(typeNextCharacter, speed); // start with delay

        return () => { currentIndex = safeText.length; };
    }, [text, speed]);

    return (
        react_1.default.createElement("span", null,
            displayText,
            !isComplete && react_1.default.createElement("span", { className: "cursor" }, "|")
        )
    );
};


/**
 * Returns a fun summary about the user's spending to the user
 * @constructor
 */
function GPTFacts() {
    // Constant used for return value
    const [aiMessage, setAiMessage] = (0, react_1.useState)("Loading insights...");
    const generateAiMessage = () => __awaiter(this, void 0, void 0, function* () {
        try {
            // Grab and error check user's transactions
            const transactions = yield (0, API_1.getCurrentUserTransactions)();
            if (!transactions) {
                console.error("Error fetching transactions:");
                setAiMessage("Could not retrieve transactions.");
                return;
            }
            // Map a list of partnerIDs from the userTransactions
            const partnerIDs = transactions.map((t) => t.partnerID);
            // Fetch a Partner for each PartnerID
            const partnerData = yield (0, API_1.getPartnerIds)(partnerIDs);
            // Error check
            if (!partnerData) {
                console.error("Error fetching partner details:");
                setAiMessage("Could not retrieve partner details.");
                return;
            }
            // Enrich transactions based on their partners and categories
            const enrichedTransactions = transactions.map((t) => {
                const partner = partnerData.find((p) => p.partnerID === t.partnerID);
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
            const completion = yield openai_1.openai.chat.completions.create({
                model: "gpt-4o-mini",
                messages: [
                    { role: "system", content: 
                        "You are writing a creative response to a user that summarizes their spending habits. " +
                        "Try to come up with quirky names for the user such as techy-trendsetter etc. " +
                        "Incorporate stats about their spending into your response e.g. \`You saved £850, thats enough to buy a new iPhone!\'" +
                        "Limit your response to 150 words." },
                    {
                        role: "user",
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
            }
            else {
                // @ts-ignore
                const cleanedMessage = response.content.trim().replace(/undefined$/, '');
                setAiMessage(cleanedMessage);
            }
        }
        catch (error) {
            console.error("Unexpected error in generateSpendingInsights:", error);
            setAiMessage("An error occurred while generating insights.");
        }
    });
    (0, react_1.useEffect)(() => { generateAiMessage().then(); }, []);
    return (react_1.default.createElement("div", null,
        react_1.default.createElement("header", null, 
            react_1.default.createElement(TypewriterEffect, { 
                text: aiMessage, 
                speed: 12
            })
        )
    ));
}
exports.default = GPTFacts;
