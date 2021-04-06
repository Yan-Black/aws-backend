const data = require('../mock');

module.exports.getProductsList = async (event) => {
  return {
    statusCode: 200,
    body: JSON.stringify(data)
  };
};
