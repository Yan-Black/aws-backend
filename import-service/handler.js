const { importProductsFile } = require('./handlers/importProductsFile');
const { importFileParser } = require('./handlers/importFileParser');
const { catalogBatchProcess } = require('./handlers/catalogBatchProcess');

module.exports = {
  importProductsFile,
  importFileParser,
  catalogBatchProcess
};
