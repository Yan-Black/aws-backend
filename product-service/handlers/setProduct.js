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

const selectAll = (title, description, price) =>
  `select * from products where title='${title}' and description='${description}' and price='${price}'`;

const handler = async (event) => {
  const client = new Client(dbOptions);
  await client.connect();

  const { body } = event;
  console.log('setProducts lambda invoked', `args: ${event.body}`);
  try {
    const { title, description, price, image } = body;

    if (!title || !description || !price) {
      return {
        statusCode: 400,
        body: 'product data is invalid!'
      };
    }

    const { rows } = await client.query(selectAll(title, description, price));

    if (rows.length > 0) {
      return {
        statusCode: 200,
        body: 'product with this data already exists'
      };
    }

    await client.query(
      `insert into products (title, description, price, image) values
      ('${title}', '${description}', ${price}, '${image || ''}')`
    );

    const {
      rows: [{ id }]
    } = await client.query(selectAll(title, description, price));

    return {
      statusCode: 200,
      body: 'new product was created!',
      id
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

const setProduct = middy(handler).use(cors());

module.exports.setProduct = setProduct;
