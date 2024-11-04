import { AzureOpenAI } from "openai";
const endpoint = process.env.AZURE_OPENAI_ENDPOINT || "https://gpt-clone.openai.azure.com/";  
const apiKey = process.env.AZURE_OPENAI_API_KEY ;  
const apiVersion = "2024-05-01-preview";  
const deployment = "gpt-35-turbo"
const embeddingsDeployment = "text-embedding-ada-002"; // Your embedding deployment name

const openai = new AzureOpenAI({
  apiKey,
  endpoint,
  apiVersion,
  deployment
});
export const embeddingsClient = new AzureOpenAI({
  apiKey,
  endpoint,
  apiVersion,
  deployment: embeddingsDeployment
});

export default openai;