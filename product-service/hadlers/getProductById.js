const data = require('../mock');

module.exports.getProductById = async (event) => {
  const { productId } = JSON.parse(event);
  return {
    statusCode: 200,
    body: JSON.stringify(data.data[productId])
  };
};
