const swaggerJsdoc = require('swagger-jsdoc');

const swaggerOptions = {
  swaggerDefinition: {
    openapi: '3.0.0', // OpenAPI 3.0 specification
    info: {
      title: 'Your API',
      version: '1.0.0',
      description: 'API documentation using Swagger',
    },
    servers: [
      {
        url: 'http://localhost:3006', // Adjust to your server URL
        description: 'Development server',
      },
    ],
  },
  apis: ['./routes/*.js'], // Path to the API route files
};

const swaggerDocs = swaggerJsdoc(swaggerOptions);

module.exports = swaggerDocs;
