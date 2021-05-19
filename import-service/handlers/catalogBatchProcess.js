const { SQS } = require('aws-sdk');
const middy = require('middy');
const { cors } = require('middy/middlewares');

const Bucket = 'aws-task-csv-bucket';

const handler = async (event, ctx, cb) => {
  const sqs = new SQS();
  const files = JSON.parse(event.body);

  files.forEach((file) => {
    sqs.sendMessage(
      {
        QueueUrl: process.env.SQS_URL,
        MessageBody: file
      },
      () => {
        console.log('file sended');
      }
    );
  });

  cb(null, {
    statusCode: 200
  });
};

module.exports.catalogBatchProcess = middy(handler).use(cors());
