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
  console.log('getProductsList lambda invoked', `args: ${event}`);
  try {
    const { rows: products } = await client.query('select * from products');
    const { rows: stocks } = await client.query('select * from stocks');

    for (let i = 0; i < products.length; i++) {
      if (products[i].id === stocks[i].product_id) {
        products[i].count = stocks[i].count;
      }
    }

    return {
      statusCode: 200,
      body: JSON.stringify({ data: products })
    };
  } catch (err) {
    console.error(
      'Unexpected error has been occured during connection to the database:',
      err
    );
  } finally {
    client.end();
  }
};

const getProductsList = middy(handler).use(cors());

module.exports.getProductsList = getProductsList;
