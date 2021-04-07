const data = require('../mock');

module.exports.getProductById = async (event) => {
  const { product } = event['queryStringParameters'];
  return {
    statusCode: 200,
    body: JSON.stringify(data.data[product])
  };
};
