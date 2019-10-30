import { APIGatewayProxyHandler } from 'aws-lambda';
import 'source-map-support/register';
import S3 from 'aws-sdk/clients/s3';
import DynamoDB from 'aws-sdk/clients/dynamodb';
import { sites, resolutions, getS3FolderPath } from '../common/index';
import { Resolution, GetSiteRequestParams } from '../common/types';

import uuid from 'uuid';

const dynamoDb = new DynamoDB.DocumentClient();
const s3 = new S3();

//TODO only allow requests from the frontend
const headers = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Credentials': true,
};

const getSitedata = (site:string, resolution: Resolution) => {
  const params = {
    Bucket: process.env['S3_DATA_BUCKET'],
    Key: `${getS3FolderPath(site, resolution)}/data.json`,
  };
  return s3.getObject(params).promise();
}

export const getSites: APIGatewayProxyHandler = async (event, _context) => {

  try {
    const params: GetSiteRequestParams = event.queryStringParameters as unknown as GetSiteRequestParams;
    const resolution = resolutions[Number(params.resolutionIdx)];
    const responses = await(Promise.all(sites.map((site:string) => getSitedata(site, resolution))));

    const sitesdata = responses.map(res => JSON.parse(res.Body.toString('utf-8')));
    return {
      headers,
      statusCode: 200,
      body: JSON.stringify({
        data: sitesdata,
      }, null, 2),
    };

  } catch(err) {
    console.log(err)
  }
}


export const evaluate: APIGatewayProxyHandler = async (event, _context) => {

  try {
    const id = uuid.v1();

    await(dynamoDb.put({
        TableName: process.env.RANKED_ELEMENTS_TABLE,
        Item: {
          id,
          ...JSON.parse(event.body),
       }
      }).promise()
      .catch(error => ({
        error,
        headers,
        status: 500,
        message: "Error occurred while writing to Dynamo",
      }))
    )

    return {
      headers,
      statusCode: 200,
      body: JSON.stringify({
        msg: 'success',
      }, null, 2),
    };

  } catch(err) {
    console.log(err)
  }
}
