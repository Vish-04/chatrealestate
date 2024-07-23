import { withApiAuthRequired } from '@auth0/nextjs-auth0';
import { NextRequest, NextResponse } from 'next/server';
import { DynamoDBClient, ScanCommand } from '@aws-sdk/client-dynamodb';
import { pipeline } from '@xenova/transformers';
import { Pinecone } from '@pinecone-database/pinecone';
import PipelineSingleton from './pipeline.js';

const dynamoDBClient = new DynamoDBClient({
  region: process.env.REGION || '',
  credentials: {
    accessKeyId: process.env.NEXT_AWS_ACCESS_KEY || '',
    secretAccessKey: process.env.NEXT_AWS_SECRET_KEY || '',
  },
});

const pc = new Pinecone({
  apiKey: process.env.PINECONE_API_KEY || ''
});




  // This line initializes a machine learning model for feature extraction using the 'Xenova/all-MiniLM-L6-v2' model.
  

type BodyPayloadType = {
  formObject: {
    Budget: number[],
    Description: string[],
    zipcodes: string[], // actually zipcodes
    beds: number[],
    baths: number[],
    size_of_house: number[],
    query: string[]
  };
};




// give GPT the list of zipcodes in the database
export const POST = async function handler(req: NextRequest) {
  if (req.method !== 'POST') {
    return NextResponse.json({ message: 'Method not allowed' }, { status: 405 });
  }

  const index = await pc.index('real-estate-listings');
  const extractor = await PipelineSingleton.getInstance()
 
  const { formObject } = (await req.json()) as BodyPayloadType;
  
  if (!formObject) {
    return NextResponse.json({ message: 'Invalid request body' }, { status: 400 });
  }

  try {
    const filters: string[] = [];
    const expressionAttributeNames: { [key: string]: string } = {};
    const expressionAttributeValues: { [key: string]: any } = {};




     // Query filters
  if (formObject.query?.length>0){
    const query = formObject.query[0];
    const queryEmbedding = await extractor(query,{ pooling: 'mean', normalize: true });
    const queryEmbeddingArray = Array.from(queryEmbedding.data);
    const queryReponse = await index.namespace('ns1').query({
      vector: queryEmbeddingArray,
      topK: 20

    })
    const queryItems = queryReponse.matches || [];

    filters.push("#id IN (" + queryItems.map((_, index) => `:id${index}`).join(", ") + ")");
    expressionAttributeNames["#id"] = "listings_detail_label";
    queryItems.forEach((item: any, index: number) => {
      expressionAttributeValues[`:id${index}`] = { S: item.id };
    });

    console.log(queryReponse)
  }
    // Size of House
    if (formObject.size_of_house?.length > 0) {
      filters.push("#sqft <= :maxSize");
      expressionAttributeNames["#sqft"] = "square_footage";
      expressionAttributeValues[":maxSize"] = { N: formObject.size_of_house[0].toString() };
    }

    // Budget
    if (formObject.Budget?.length >= 2) {
      filters.push("#price >= :minPrice AND #price <= :maxPrice");
      expressionAttributeNames["#price"] = "listing_detail_price";
      expressionAttributeValues[":minPrice"] = { N: formObject.Budget[0].toString() };
      expressionAttributeValues[":maxPrice"] = { N: formObject.Budget[1].toString() };
    } else if (formObject.Budget?.length === 1) {
      filters.push("#price <= :minPrice");
      expressionAttributeNames["#price"] = "listing_detail_price";
      expressionAttributeValues[":minPrice"] = { N: formObject.Budget[0].toString() };
    }
    // if only 1 value than make sure it's 0 - min or max
   // Bedrooms
   if (formObject.beds?.length > 0) {
    filters.push("#bedrooms <= :maxBedrooms");
    expressionAttributeNames["#bedrooms"] = "bedrooms";
    expressionAttributeValues[":maxBedrooms"] = { N: formObject.beds[0].toString() };
  }
 
  // Bathrooms
  if (formObject.baths?.length > 0) {
    filters.push("#bathrooms <= :maxBathrooms");
    expressionAttributeNames["#bathrooms"] = "bathrooms";
    expressionAttributeValues[":maxBathrooms"] = { N: formObject.baths[0].toString() };
  }
  // if only 1 value than make sure it's 0 - min or max

  // Zipcodes
  if (formObject.zipcodes?.length > 0) {
    filters.push("#zipcode IN (" + formObject.zipcodes.map((_, index) => `:zipcode${index}`).join(", ") + ")");
    expressionAttributeNames["#zipcode"] = "zipcode";
    formObject.zipcodes.forEach((zipcode: string, index: number) => {
      expressionAttributeValues[`:zipcode${index}`] = { S: zipcode };
    });
  }




    // Combine all filters into a single filter expression
    const filterExpression = filters.join(" AND ");

    if (filters.length === 0) {
      return NextResponse.json({ message: 'No valid filters provided' }, { status: 400 });
    }


    // Fetch data from DynamoDB
    const command = new ScanCommand({
      TableName: process.env.LISTING_TABLE!,
      FilterExpression: filterExpression,
      ExpressionAttributeNames: expressionAttributeNames,
      ExpressionAttributeValues: expressionAttributeValues,
    });

    const data = await dynamoDBClient.send(command);

    // Check if items exist
    if (!data.Items || data.Items.length === 0) {
      return NextResponse.json({ message: 'No items found' }, { status: 404 });
    }

    
    // Convert query to sentence embedding and query Pinecone if a query is provided
    console.log(filters)
    console.log(filterExpression)
    // Return the fetched data and Pinecone results in the response
    return NextResponse.json({ data: data.Items}, { status: 200 });
  } catch (error) {
    console.error('Error querying DynamoDB:', error);
    return NextResponse.json({ message: 'Internal server error', error: (error as Error).message }, { status: 500 });
  }
};


// pretty much the zipcodes given in locations you need to search for listings with that zipcode
// make one where we look into the listing detail label and we check if the city they specified is in there and make sure to lower case all of them so you don't run into problem
// if a query is given than run the get top20matches query for the top 20 matches using the listings_detail_label this should all be based upon wether a query is given or not