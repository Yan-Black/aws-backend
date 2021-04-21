const { getProductsList } = require('./handlers/getProductsList');
const { getProductById } = require('./handlers/getProductById');
const { setProduct } = require('./handlers/setProduct');

module.exports = {
  getProductsList,
  getProductById,
  setProduct
};
