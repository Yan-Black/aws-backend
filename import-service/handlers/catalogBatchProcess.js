const { Client } = require('pg');
const { SNS } = require('aws-sdk');
const middy = require('middy');
const { cors } = require('middy/middlewares');

const { host, port, database, user, password } = process.env;

const dbOptions = {
  host,
  port,
  database,
  user,
  password,
  ssl: {
    rejectUnauthorized: false
  },
  connectionTimeoutMillis: 5000
};

const selectAll = (title, description, price) =>
  `select * from products where title='${title}' and description='${description}' and price='${price}'`;

const handler = async (event) => {
  const sns = new SNS();
  const client = new Client(dbOptions);
  await client.connect();

  const productsList = event.Records.map(({ body }) => body);

  productsList.forEach(async (product) => {
    const { title, description, price, image } = JSON.parse(product);

    await client.query(
      `insert into products (title, description, price, image) values
      ('${title}', '${description}', ${price}, '${image || ''}')`
    );

    const {
      rows: [{ id }]
    } = await client.query(selectAll(title, description, price));

    await client.query(
      `insert into stocks (product_id, count) values
      ('${id}', '1')`
    );

    sns.publish(
      {
        Subject: 'New product submited',
        Message: JSON.stringify(product),
        TopicArn: process.env.SNS_ARN
      },
      () => {
        console.log('Email sended');
      }
    );
  });
};

module.exports.catalogBatchProcess = middy(handler).use(cors());
