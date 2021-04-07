const data = require('../mock');

module.exports.getProductById = async (event) => {
  const { product } = event['queryStringParameters'];
  return {
    headers: {
      'Access-Control-Allow-Headers': 'Content-Type',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET'
    },
    statusCode: 200,
    body: JSON.stringify(data.data[product])
  };
};
