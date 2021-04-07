const data = require('../mock');

module.exports.getProductsList = async (event) => {
  return {
    headers: {
      'Access-Control-Allow-Headers': 'Content-Type',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET'
    },
    statusCode: 200,
    body: JSON.stringify(data)
  };
};
