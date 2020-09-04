import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import AWS from 'aws-sdk';
import { v4 } from 'uuid';

const options = {
    region: 'localhost',
    endpoint: 'http://localhost:8000',
};

const documentClient = new AWS.DynamoDB.DocumentClient(options);

async function get(id: string, TableName: string) {
    const params = { TableName, Key: { id } };

    const data = await documentClient.get(params).promise();

    return data.Item;
}

async function put(user: any, TableName: string) {
    const id = v4();
    user.id = id;

    const params = {
        TableName,
        Item: user,
    };

    const data = await documentClient.put(params).promise();

    return data;
}

export default async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const user = await put({name: "TestUser"}, "TEST")
    
    //const user_return = get(user.id, "DynamoDBTable")

    return {
        statusCode: 200,
        body: JSON.stringify(user)
    }
};