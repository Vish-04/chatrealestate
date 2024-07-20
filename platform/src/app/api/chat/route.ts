import { NextRequest, NextResponse } from 'next/server';
import { withApiAuthRequired } from '@auth0/nextjs-auth0';
import { OpenAI } from '@langchain/openai';
import { ChatHistoryType } from '@/utils/types';
import { ChatOpenAI } from "@langchain/openai";
import { JsonOutputFunctionsParser } from "langchain/output_parsers";
import { HumanMessage } from "@langchain/core/messages";

type BodyPayloadType = {
  prompt: string;
  chatHistory: ChatHistoryType;
  userInfo: any
};

export const POST = withApiAuthRequired(async (req: NextRequest) => {
  try {
    const { prompt, chatHistory, userInfo } = (await req.json()) as BodyPayloadType;
    console.log("USER INFO", userInfo)

    if (!prompt || !chatHistory || !userInfo) {
      return NextResponse.json({ message: 'Missing Fields' }, { status: 400 });
    }

    const classificationModel = new OpenAI({
      model: 'gpt-3.5-turbo-instruct',
      apiKey: process.env.OPENAI_API_KEY,
      maxTokens: 150,
    });

    const generationModel = new OpenAI({
      model: 'gpt-3.5-turbo-instruct',
      apiKey: process.env.OPENAI_API_KEY,
      maxTokens: 150,
    });


    // Format chat history
    const formattedHistory: string = chatHistory.messages?.L.map((entry) => {
      return `${entry.M.role.S}: ${entry.M.content.S}${entry.M.componentProps?.M.componentType?.S ? ` (Component Type: ${entry.M.componentProps?.M.componentType?.S})` : ''}${entry.M.componentProps?.M.componentValue?.S ? ` (Component Value: ${entry.M.componentProps?.M.componentValue?.S})` : ''}`;
    }).join('\n');

    let classificationPromptTemplate = `Your job is when given the user question, the conversation history, a stringified JSON of the users information which includes their preferences in terms of what kind of houses they are looking for, to return a stringified JSON object containing an updated user information object with fields updated or answered from the user question, with an extra key value pair, with key as "responseType" and value as the key of any of the users information that needs to be updated. Be sure to include all of the previous fields in the user information object in your response
    
    For example, if the input is, as following: user information :{"locations":[], "budget":[], "house_descriptions":"A small cozy house", "size_of_house":[1000,2000], "beds_baths":[]} user question: "I'm looking for houses around Gold River" Your output should be: ${JSON.stringify({"locations":["Gold River"], "budget":[], "house_descriptions":"A small cozy house", "size_of_house":[1000,2000], "beds_baths":[], responseType: "budget"})}. This is because the users question includes a location, so the user information object is updated with the location "Gold River", and because the first unfilled section is budget, the responseType is set to budget. Ensure you only respond with a stringified JSON object and no other characters or words besides that. If i run JSON.parse(yourResponse) I should get a valid json with these strict typings. Ensure you do not change the names of the keys, they must stay the same, you can just change the values, only if the user inquiry has updated or new information. If all information is filled, or you are unsure what the responseType should be, make it equal to "generic". Remeber it is highly important that your response should be ONLY A JSON STRINGIFIED OBJECT. do not use the example to populate the object, but only the information below.
    
    Conversation History: """ ${formattedHistory} """
    User Question: """ ${prompt} """
    User Information: """ ${JSON.stringify(userInfo)} """`;    

    const classificationResponse = await classificationModel.invoke(classificationPromptTemplate);

    console.log("CLASSIFICATION RES", classificationResponse)

    // Instantiate the parser
    const parser = new JsonOutputFunctionsParser();

    // Define the function schema
    const extractionFunctionSchema = {
      name: "extractor",
      description: "Extracts fields from the input.",
      parameters: {
        type: "object",
        properties: {
          responseType: {
            type: "string",
            description: "A string of The type of response needed",
          },
          locations: {
            type: "array",
            items: { type: "string" }, // Added items property
            description: "An array of strings locations the user is looking for",
          },
          house_descriptions: {
            type: "array",
            items: { type: "string" }, // Added items property
            description: "An array of strings of descriptions for the users ideal house"
          },
          size_of_house: {
            type: "array",
            items: { type: "number" }, // Added items property
            description: "An array of two numbers of the size of the house the user is looking for in sqft"
          },
          beds_baths: {
            type: "array",
            items: { type: "string" }, // Added items property
            description: "An array of numbers of the number of beds and bathrooms the user is looking for"
          },
          budget: {
            type: "array",
            items: { type: "number" }, // Added items property
            description: "An array of two numbers of the budget range of the user"
          },
          window_shopping: {
            type: "boolean",
            description: "A boolean of whether the user is seriously thinking about buying a house in the next 2 years"
          },
        },
        required: ["responseType"],

      },
    };

    // Instantiate the ChatOpenAI class
    const model = new ChatOpenAI({ model: "gpt-4" });

    // Create a new runnable, bind the function to the model, and pipe the output through the parser
    const runnable = model
      .bind({
        functions: [extractionFunctionSchema],
        function_call: { name: "extractor" },
      })
      .pipe(parser);

    // Invoke the runnable with the classification response
    const updatedUserInfo= (await runnable.invoke([
      new HumanMessage(classificationResponse),
    ])) as {
      responseType: string,
      locations: string[],
      house_descriptions: string[],
      size_of_house: number[],
      beds_baths: number[],
      budget: number[],
      window_shopping: boolean
    }  

    console.log("JSON OBJ", updatedUserInfo)

    let generationPromptTemplate = `You are an AI realtor assistant. You have a database of listings. Given the user information, conversation history, and user question, generate a response to the user question which is based on the conversation history and user information. Always be polite. Keep your responses short and concise.`;
    
    let componentType = '';
    
    try{

      console.log("JSON OBJ", updatedUserInfo)
      if(updatedUserInfo.responseType === 'name'){
        generationPromptTemplate += `\n\nIn your response, make sure that you not only give them what they want, but also inquire about their name in a subtle fashion. Asking something like "whats is a good name or nick name to call you by" or something along the lines that flows well with your response is advised`;

      }
      if(updatedUserInfo.responseType === 'budget'){
        generationPromptTemplate += `\n\nIn your response, make sure that you not only give them what they want, but also inquire about their budget in a subtle fashion. Asking something like "whats is a good budget range for the houses" or something along the lines that flows well with your response is advised`;
        componentType = 'budget';
      }
      if (updatedUserInfo.responseType === 'locations') {
        generationPromptTemplate += `\n\nIn your response, make sure that you not only give them what they want, but also inquire about their ideal location for their house in a subtle fashion. Asking something like "do you have any specific regions or locations in mind? zip codes work too" or something along the lines that flows well with your response is advised`;
      }
      if (updatedUserInfo.responseType === 'window_shopping') {
        generationPromptTemplate += `\n\nIn your response, make sure that you not only give them what they want, but also inquire if they are seriously thinking about buying a house in the next 2 years in a subtle fashion. Asking something like "Just wondering, do you plan on buying a house in the next 2 years or so?" or something along the lines that flows well with your response is advised`;
        componentType = 'boolean';
      }
      if(updatedUserInfo.responseType === 'size_of_house'){
        generationPromptTemplate += `\n\nIn your response, make sure that you not only give them what they want, but also inquire about their ideal size of house in a subtle fashion, the size being square feet. Asking something like "whats an ideal size of a house in square feet" or something along the lines that flows well with your response is advised`;

      }
      if (updatedUserInfo.responseType === 'house_descriptions') {
        generationPromptTemplate += `\n\nIn your response, make sure that you not only give them what they want, but also inquire about their ideal house description in a subtle fashion. Asking something like "whats are you looking for in the house" or something along the lines that flows well with your response is advised`;
      }
      if (updatedUserInfo.responseType === 'beds_bath') {
        generationPromptTemplate += `\n\nIn your response, make sure that you not only give them what they want, but also inquire about their ideal number of beds and bathrooms in a subtle fashion. Asking something like "whats are you looking for in the house" or something along the lines that flows well with your response is advised`;
      }

    } catch (error) {
      console.error("ERROR", error)
    }

    generationPromptTemplate += `\n\nConversation History: """ ${formattedHistory} """
    User Question: """ ${prompt} """
    ${updatedUserInfo ? `User Information: """ ${JSON.stringify(updatedUserInfo)} 
    assistant:"""` : ''}`;

    const response = await generationModel.invoke(generationPromptTemplate);

    return NextResponse.json({role: "assistant", content: response, componentType: componentType, updatedUserInfo: updatedUserInfo }, { status: 200 });
  } catch (error) {
    console.error('Error querying OpenAI:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
});