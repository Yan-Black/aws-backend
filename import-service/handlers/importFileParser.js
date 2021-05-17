const { S3 } = require('aws-sdk');
const csv = require('csv-parser');
const middy = require('middy');
const { cors } = require('middy/middlewares');

const Bucket = 'aws-task-csv-bucket';

const handler = async (event) => {
  const s3 = new S3({ region: 'eu-west-1' });

  let statusCode = 200;

  for (const record of event.Records) {
    await new Promise((resolve, reject) => {
      const stream = s3
        .getObject({ Bucket, Key: record.s3.object.key })
        .createReadStream()
        .pipe(csv());

      stream.on('data', (data) => {
        console.log(data);
      });

      stream.on('error', () => {
        statusCode = 500;
        reject();
      });

      stream.on('end', async () => {
        await s3
          .copyObject({
            Bucket,
            CopySource: `${Bucket}/${record.s3.object.key}`,
            Key: record.s3.object.key.replace('uploaded', 'parsed')
          })
          .promise();

        await s3
          .deleteObject({
            Bucket,
            Key: record.s3.object.key
          })
          .promise();

        resolve();
      });
    });
  }

  return {
    statusCode
  };
};

module.exports.importFileParser = middy(handler).use(cors());
