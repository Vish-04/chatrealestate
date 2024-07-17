/**
* Handler that will be called during the execution of a PostLogin flow.
*
* @param {Event} event - Details about the user and the context in which they are logging in.
* @param {PostLoginAPI} api - Interface whose methods can be used to change the behavior of the login.
*/
//@ts-ignore
const AWS = require('aws-sdk');
//@ts-ignore
const { v4: uuidv4 } = require('uuid');

//@ts-ignore
exports.onExecutePostLogin = async (event, api) => {
  console.log("IN", event.user)


  // Configure AWS SDK
  const dynamoDB = new AWS.DynamoDB.DocumentClient({
    region: event.secrets.REGION,
    accessKeyId: event.secrets.AWS_ACCESS,
    secretAccessKey: event.secrets.AWS_SECRET
  });

  const searchParams = {
    TableName: event.secrets.TABLE_NAME,
    FilterExpression: '#email = :email',
    ExpressionAttributeNames: {
      '#email': 'email'
    },
    ExpressionAttributeValues: {
      ':email': event.user.email
    }
  };

  try {
    const result = await dynamoDB.scan(searchParams).promise();
    console.log("RES", result)
    if (result.Items.length <= 0) {    

  const userId = uuidv4();
  console.log("USER", event.user)
  const user = {
    user_id: userId,
    email: event.user.email,
    name: event.user.name || undefined,
    chats: [],
    geoip: event?.request?.geoip || undefined,
    ip: event?.request?.ip || undefined
  };

  const params = {
    TableName: event.secrets.TABLE_NAME,
    Item: user
  };

  const userPreferences = {
    user_id: userId,
    budget: 0,
    locations: [],
    window_shopping: undefined,
    house_descriptions: [],
    size_of_house:[],
    beds_baths: [],
    property_types: []
  }

  const paramsTwo = {
    TableName: event.secrets.TABLE_NAME_TWO,
    Item: userPreferences
  }

  try {
    await dynamoDB.put(params).promise();
    console.log('User added to DynamoDB:', user);
    await dynamoDB.put(paramsTwo).promise()
    console.log('UserPreferences added to DynamoDB:', userPreferences)
  } catch (error) {
    console.error('Error adding user to DynamoDB:', error);
  }
  } else {
      console.log('Email found in the database:', event.user.email);
    }
  } catch (error) {
    console.error('Error querying DynamoDB:', error);
  }
};