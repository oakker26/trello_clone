import { OpenAI } from "openai";
const configuration = {
  apiKey: process.env.OPENAI_API_KEY,
  organization: "org-yPmvc7lH2eHIt4EY5RP3kTjP",
};
const openai = new OpenAI(configuration);

export default openai;
