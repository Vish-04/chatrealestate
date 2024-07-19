import { withApiAuthRequired } from '@auth0/nextjs-auth0';
import { DynamoDBClient, UpdateItemCommand } from '@aws-sdk/client-dynamodb';
import { NextRequest, NextResponse } from 'next/server';

const dynamoDBClient = new DynamoDBClient({
  region: process.env.REGION || '',
  credentials: {
    accessKeyId: process.env.NEXT_AWS_ACCESS_KEY || '',
    secretAccessKey: process.env.NEXT_AWS_SECRET_KEY || '',
  },
});

export const POST = withApiAuthRequired(async function handler(req: NextRequest) {
  if (req.method !== 'POST') {
    return NextResponse.json({ message: 'Method not allowed' }, { status: 405 });
  }

  const { chatObject, email } = await req.json();

  if (!chatObject || !chatObject.chatId || !email) {
    return NextResponse.json({ message: 'Invalid request body' }, { status: 400 });
  }

  const formattedChatObject = {
    chat_id: { S: chatObject.chatId },
    email: { S: email },
    messages: {
      L: chatObject.messages.map((msg: any) => ({
        M: {
          role: { S: msg.role },
          content: { S: msg.content },
          componentProps: msg.componentProps ? {
            M: {
              componentType: { S: msg.componentProps.componentType || '' },
              value: { S: JSON.stringify(msg.componentProps.value) || '' }
            }
          } : { NULL: true }
        }
      }))
    }
  };

  const params = {
    TableName: process.env.CHATS_TABLE!,
    Key: {
      chat_id: { S: chatObject.chatId },
      email: { S: email },
    },
    UpdateExpression: 'SET messages = :messages',
    ExpressionAttributeValues: {
      ':messages': { L: formattedChatObject.messages.L }, // Ensure the correct format
    },
  };

  try {
    //@ts-ignore
    const command = new UpdateItemCommand(params);
    await dynamoDBClient.send(command);
    return NextResponse.json({ message: 'Chat history updated successfully' }, { status: 200 });
  } catch (error) {
    console.error('Error updating chat history in DynamoDB:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
});