import { withApiAuthRequired } from '@auth0/nextjs-auth0';
import { NextRequest, NextResponse } from 'next/server';
import { DynamoDBClient, ScanCommand } from '@aws-sdk/client-dynamodb';

const dynamoDBClient = new DynamoDBClient({
  region: process.env.REGION || '',
  credentials: {
    accessKeyId: process.env.NEXT_AWS_ACCESS_KEY || '',
    secretAccessKey: process.env.NEXT_AWS_SECRET_KEY || '',
  },
});

type BodyPayloadType = {
  formObject: {
    Budget: number[],
    Description: string[],
    locations: string[],
    beds_bath: number[],
    size_of_house: number[],
    query: string
  };
};

export const POST = async function handler(req: NextRequest) {
  if (req.method !== 'POST') {
    return NextResponse.json({ message: 'Method not allowed' }, { status: 405 });
  }

  const { formObject } = (await req.json()) as BodyPayloadType;

  if (!formObject) {
    return NextResponse.json({ message: 'Invalid request body' }, { status: 400 });
  }

  try {
    const filters: string[] = [];
    const expressionAttributeNames: { [key: string]: string } = {};
    const expressionAttributeValues: { [key: string]: any } = {};

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
    }
   // Bedrooms and Bathrooms
   if (Array.isArray(formObject.beds_bath) && formObject.beds_bath.length >= 2) {
    filters.push("#bedrooms <= :maxBedrooms");
    filters.push("#bathrooms <= :maxBathrooms");
    expressionAttributeNames["#bedrooms"] = "#_of_rooms";
    expressionAttributeNames["#bathrooms"] = "bathrooms";
    expressionAttributeValues[":maxBedrooms"] = { N: formObject.beds_bath[0].toString() };
    expressionAttributeValues[":maxBathrooms"] = { N: formObject.beds_bath[1].toString() };
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

    // Return the fetched data in the response
    return NextResponse.json({ data: data.Items }, { status: 200 });
  } catch (error) {
    console.error('Error querying DynamoDB:', error);
    return NextResponse.json({ message: 'Internal server error', error: (error as Error).message }, { status: 500 });
  }
};