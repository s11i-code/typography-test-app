import { APIGatewayProxyHandler } from 'aws-lambda';
import 'source-map-support/register';
import S3 from 'aws-sdk/clients/s3';
import DynamoDB from 'aws-sdk/clients/dynamodb';
import { sites, resolutions, getS3FolderPath, FRONTEND_URL } from '../common/index';
import { Resolution, GetSiteRequestParams } from '../common/types';

import uuid from 'uuid';

const dynamoDb = new DynamoDB.DocumentClient();
const s3 = new S3();

const headers = {
  'Access-Control-Allow-Origin': FRONTEND_URL,
  'Access-Control-Allow-Credentials': true,
};

const getSitedata = (site:string, resolution: Resolution) => {
  const params = {
    Bucket: process.env['S3_DATA_BUCKET'],
    Key: `${getS3FolderPath(site, resolution)}/data.json`,
  };
  return s3.getObject(params).promise();
}

function selectEvaluatedResolution(windowWidth: number): Resolution {
  // select the closest resolution which is bigger than window width
  const diffs = resolutions.map(({ width }) => width - windowWidth)
  const bestIndex =  diffs.reduce((bestIdx, diff, currIdx) => (diff >= 0 && diff < Math.abs(diffs[bestIdx]) ? currIdx : bestIdx), diffs.length - 1)
  return resolutions[bestIndex]
}

export const getSites: APIGatewayProxyHandler = async (event, _context) => {

  try {
    const params: GetSiteRequestParams = event.queryStringParameters as unknown as GetSiteRequestParams;
    if(!params || !params.windowWidth) {
      return {
        headers,
        statusCode: 400,
        body: JSON.stringify({
          msg: "Please specify resolution.",
        }, null, 2),
      };
    }

    const windowWidth = Number(params.windowWidth)
    const resolution = selectEvaluatedResolution(windowWidth);
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
      }).promise())

    return {
      headers,
      statusCode: 200,
      body: JSON.stringify({
        msg: 'success',
      }, null, 2),
    };

  } catch(err) {
    console.log('Error encountered', err)
    return {
      headers,
      statusCode: 500,
      body: JSON.stringify({
        msg: 'error',
      }, null, 2),
    };
  }
}
