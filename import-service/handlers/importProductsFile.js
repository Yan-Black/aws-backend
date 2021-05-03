const { S3 } = require('aws-sdk');
const middy = require('middy');
const { cors } = require('middy/middlewares');

const Bucket = 'aws-task-csv-bucket';

const handler = async (event) => {
  const s3 = new S3({ region: 'eu-west-1' });

  const { name } = event['queryStringParameters'];

  if (name) {
    const Key = `uploaded/${name}`;
    const params = {
      Bucket,
      Key,
      Expires: 60,
      ContentType: 'text/csv'
    };

    let statusCode = 200;
    let signedUrl = '';
    let message = '';

    await new Promise((res, rej) => {
      s3.getSignedUrl('putObject', params, (err, url) => {
        err ? rej(err) : res(url);
      });
    })
      .then((url) => {
        signedUrl = url;
      })
      .catch(({ message }) => {
        statusCode = 500;
        message = message;
      });

    const response = {
      statusCode,
      body: JSON.stringify({ signedUrl, message })
    };

    return response;
  }
};

module.exports.importProductsFile = middy(handler).use(cors());
