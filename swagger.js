const YAML = require("yamljs");
const swaggerUi = require("swagger-ui-express");

const swaggerDocument = YAML.load("./src/docs/swagger.yaml");

module.exports = {
  swaggerUi,
  swaggerDocument,
};