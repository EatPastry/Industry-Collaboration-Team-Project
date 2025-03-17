"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.openai = void 0;
const openai_1 = __importDefault(require("openai"));
const openai = new openai_1.default({
    apiKey: "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",
    dangerouslyAllowBrowser: true
});
exports.openai = openai;
