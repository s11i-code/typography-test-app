const REGION = "eu-central-1";

const config = {
  development: {
    apiGateway: {
      REGION,
      URL: "http://localhost:3000",
    },
  },
  production: {
    apiGateway: {
      REGION,
      URL: "https://3ufxlzss8b.execute-api.eu-central-1.amazonaws.com/dev",
    },
  },
};
const env = process.env.NODE_ENV || "development";
export default (config as any)[env] ;

export const maxSelectableElements = 3;
