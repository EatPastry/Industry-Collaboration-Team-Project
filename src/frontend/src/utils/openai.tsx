import OpenAI from "openai";

const openai = new OpenAI({
    apiKey: "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",
    dangerouslyAllowBrowser: true
});

export { openai };