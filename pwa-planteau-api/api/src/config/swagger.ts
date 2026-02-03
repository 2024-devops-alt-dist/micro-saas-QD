import swaggerJsdoc from 'swagger-jsdoc';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Planteau API',
      version: '1.0.0',
      description: 'API documentation for Planteau - Plant management application',
      contact: {
        name: 'Planteau Team',
        email: 'support@planteau.local',
      },
    },
    servers: [
      {
        url: 'http://localhost:3000/api',
        description: 'Development server',
      },
      {
        url: '/api',
        description: 'Relative server',
      },
    ],
    components: {
      schemas: {
        User: {
          type: 'object',
          required: ['email', 'password', 'role'],
          properties: {
            id: {
              type: 'integer',
              example: 1,
            },
            email: {
              type: 'string',
              format: 'email',
              example: 'user@example.com',
            },
            password: {
              type: 'string',
              format: 'password',
              example: 'password123',
            },
            first_name: {
              type: 'string',
              example: 'John',
            },
            last_name: {
              type: 'string',
              example: 'Doe',
            },
            role: {
              type: 'string',
              enum: ['ADMIN', 'USER', 'GUEST'],
              example: 'USER',
            },
            household_id: {
              type: 'integer',
              nullable: true,
              example: 1,
            },
            created_at: {
              type: 'string',
              format: 'date-time',
            },
            updated_at: {
              type: 'string',
              format: 'date-time',
            },
          },
        },
        Plant: {
          type: 'object',
          required: ['name', 'type', 'user_id'],
          properties: {
            id: {
              type: 'integer',
              example: 1,
            },
            name: {
              type: 'string',
              example: 'Monstera Deliciosa',
            },
            scientific_name: {
              type: 'string',
              example: 'Monstera deliciosa',
            },
            type: {
              type: 'string',
              example: 'TROPICAL',
            },
            image: {
              type: 'string',
              nullable: true,
              example: 'https://example.com/monstera.jpg',
            },
            water_need: {
              type: 'integer',
              example: 7,
              description: 'Watering frequency in days',
            },
            room: {
              type: 'string',
              nullable: true,
              example: 'Living Room',
            },
            user_id: {
              type: 'integer',
              example: 1,
            },
            household_id: {
              type: 'integer',
              nullable: true,
              example: 1,
            },
            created_at: {
              type: 'string',
              format: 'date-time',
            },
            updated_at: {
              type: 'string',
              format: 'date-time',
            },
          },
        },
        Task: {
          type: 'object',
          required: ['type', 'date', 'plant_id'],
          properties: {
            id: {
              type: 'integer',
              example: 1,
            },
            type: {
              type: 'string',
              enum: ['WATERING', 'FERTILIZING', 'REPOTTING', 'PRUNING'],
              example: 'WATERING',
            },
            date: {
              type: 'string',
              format: 'date',
              example: '2026-02-03',
            },
            status: {
              type: 'string',
              enum: ['PENDING', 'COMPLETED'],
              example: 'PENDING',
            },
            plant_id: {
              type: 'integer',
              example: 1,
            },
            user_id: {
              type: 'integer',
              nullable: true,
              example: 1,
            },
            created_at: {
              type: 'string',
              format: 'date-time',
            },
            updated_at: {
              type: 'string',
              format: 'date-time',
            },
          },
        },
        Note: {
          type: 'object',
          required: ['content', 'plant_id'],
          properties: {
            id: {
              type: 'integer',
              example: 1,
            },
            content: {
              type: 'string',
              example: 'Plant shows signs of root rot',
            },
            plant_id: {
              type: 'integer',
              example: 1,
            },
            user_id: {
              type: 'integer',
              nullable: true,
              example: 1,
            },
            created_at: {
              type: 'string',
              format: 'date-time',
            },
            updated_at: {
              type: 'string',
              format: 'date-time',
            },
          },
        },
        Household: {
          type: 'object',
          required: ['name'],
          properties: {
            id: {
              type: 'integer',
              example: 1,
            },
            name: {
              type: 'string',
              example: 'My Home',
            },
            location: {
              type: 'string',
              nullable: true,
              example: 'Paris, France',
            },
            created_at: {
              type: 'string',
              format: 'date-time',
            },
            updated_at: {
              type: 'string',
              format: 'date-time',
            },
          },
        },
        Error: {
          type: 'object',
          properties: {
            error: {
              type: 'string',
              example: 'Resource not found',
            },
          },
        },
      },
      responses: {
        NotFound: {
          description: 'Resource not found',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/Error',
              },
            },
          },
        },
        BadRequest: {
          description: 'Invalid request payload',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/Error',
              },
            },
          },
        },
        Unauthorized: {
          description: 'Authentication required',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/Error',
              },
            },
          },
        },
      },
    },
  },
  apis: ['./src/routes/*.ts'],
};

export const swaggerSpec = swaggerJsdoc(options);
