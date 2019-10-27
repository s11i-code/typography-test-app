import { APIGatewayProxyHandler } from 'aws-lambda';
import 'source-map-support/register';
import S3 from 'aws-sdk/clients/s3';
import {sites, resolutions, getS3FolderPath} from '../common/index.js';

const s3 = new S3();
const resolution = resolutions[0];

const getSitedata = (site:string) => {
  const params = {
    Bucket: process.env['S3_DATA_BUCKET'],
    Key: `${getS3FolderPath(site, resolution)}/data.json`,
  };
  console.log('params key', params.Key)
  return s3.getObject(params).promise();
}

export const getSites: APIGatewayProxyHandler = async (_context) => {

  try {
    const responses = await(Promise.all(sites.map((site:string) => getSitedata(site))));
    const sitesdata = responses.map(res => JSON.parse((<any>res).Body.toString('utf-8')));
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true,
      },
      body: JSON.stringify({
        data: sitesdata,
      }, null, 2),
    };

  } catch(err) {
    console.log(err)
  }
}
