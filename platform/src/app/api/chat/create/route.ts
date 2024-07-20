import { chatStarter } from '@/utils/vars';
import { withApiAuthRequired } from '@auth0/nextjs-auth0';
import { DynamoDBClient, PutItemCommand, UpdateItemCommand } from '@aws-sdk/client-dynamodb';
import { NextRequest, NextResponse } from 'next/server';

const dynamoDBClient = new DynamoDBClient({
  region: process.env.REGION || '',
  credentials: {
    accessKeyId: process.env.NEXT_AWS_ACCESS_KEY || '',
    secretAccessKey: process.env.NEXT_AWS_SECRET_KEY || '',
  },
});

type ChatCreateRequestBody = {
  email: string;
  chat_uuid: string;
  initialMessage: string;
}

export const POST = withApiAuthRequired(async function handler(req: NextRequest) {
  if (req.method !== 'POST') {
    return NextResponse.json({ message: 'Method not allowed' }, { status: 405 });
  }

  const { email, chat_uuid, initialMessage } = await req.json() as ChatCreateRequestBody;

  if (!email || !chat_uuid || !initialMessage) {
    return NextResponse.json({ message: 'Invalid request body' }, { status: 400 });
  }


  const chatItem = {
    TableName: process.env.CHATS_TABLE!,
    Item: {
      chat_id: { S: chat_uuid },
      email: { S: email },
      messages: { L: [{M: chatStarter}, {M: {role: {S: "user"}, content: {S: initialMessage}}}] },
      createdAt: { S: new Date().toISOString() },
    },
  };



  try {
    //@ts-ignore
    await dynamoDBClient.send(new PutItemCommand(chatItem));
    return NextResponse.json({ message: 'Chat created and user updated successfully' }, { status: 200 });
  } catch (error) {
    console.error('Error interacting with DynamoDB:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
});