// swagger.js
const swaggerJsDoc = require('swagger-jsdoc');

const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Box Office API',
      version: '1.0.0',
      description: 'API documentation for Box Office data',
    },
  },
  apis: ['./boxoff.js'], // path to the API docs
};

const swaggerSpec = swaggerJsDoc(swaggerOptions);
module.exports = swaggerSpec;
