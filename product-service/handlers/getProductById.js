const { Client } = require('pg');
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

const handler = async (event) => {
  const client = new Client(dbOptions);
  await client.connect();
  console.log(
    'getProductById lambda invoked',
    `args: ${event['queryStringParameters']}`
  );
  const { product: id } = event['queryStringParameters'];

  try {
    const { rows: product } = await client.query(
      `select * from products where id='${id}'`
    );

    return {
      statusCode: 200,
      body: JSON.stringify({ data: product })
    };
  } catch (err) {
    return {
      statusCode: 500,
      message: `Unexpected error has been occured during connection to the database: ${err}`
    };
  } finally {
    client.end();
  }
};

const getProductById = middy(handler).use(cors());

module.exports.getProductById = getProductById;
