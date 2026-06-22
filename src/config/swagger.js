const swaggerJsdoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");
const path = require("path");
const config = require("./config");

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Nanos E-Commerce API",
      version: "1.0.0",
      description:
        "A comprehensive RESTful API for an E-commerce application with authentication, user management, and more.",
      contact: {
        name: "API Support",
        email: "support@nanos.com",
      },
    },
    servers: [
      {
        // Auto-detect server URL based on environment
        url: process.env.VERCEL_URL
          ? `https://nanos-ten.vercel.app`
          : process.env.API_URL
            ? `${process.env.API_URL}`
            : `http://localhost:${config.port || 5000}`,
        description: process.env.VERCEL_URL
          ? "Production (Vercel)"
          : "Local Development",
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
          description: "Enter your JWT token",
        },
      },
      schemas: {
        User: {
          type: "object",
          properties: {
            _id: {
              type: "string",
              description: "User ID",
            },
            firstName: {
              type: "string",
              description: "User first name",
            },
            lastName: {
              type: "string",
              description: "User last name",
            },
            email: {
              type: "string",
              description: "User email",
            },
            phone: {
              type: "string",
              description: "User phone",
            },
            profileImage: {
              type: "string",
              description: "Profile image URL",
            },
            role: {
              type: "string",
              enum: ["super-admin", "admin", "user"],
              description: "User role",
            },
            isActive: {
              type: "boolean",
              description: "Is user active",
            },
            createdAt: {
              type: "string",
              format: "date-time",
            },
            updatedAt: {
              type: "string",
              format: "date-time",
            },
          },
        },
        Contact: {
          type: "object",
          properties: {
            _id: {
              type: "string",
            },
            name: {
              type: "string",
            },
            email: {
              type: "string",
            },
            phone: {
              type: "string",
            },
            message: {
              type: "string",
            },
            isRead: {
              type: "boolean",
            },
            createdAt: {
              type: "string",
              format: "date-time",
            },
          },
        },
        Error: {
          type: "object",
          properties: {
            success: {
              type: "boolean",
              example: false,
            },
            message: {
              type: "string",
              description: "Error message",
            },
          },
        },
        Success: {
          type: "object",
          properties: {
            success: {
              type: "boolean",
              example: true,
            },
            message: {
              type: "string",
              description: "Success message",
            },
            data: {
              type: "object",
              description: "Response data",
            },
          },
        },
      },
    },
    tags: [
      {
        name: "Authentication",
        description: "Authentication and authorization endpoints",
      },
      {
        name: "Users",
        description: "User profile management endpoints",
      },
      {
        name: "Admin",
        description: "Admin management endpoints",
      },
      {
        name: "Contact",
        description: "Contact form endpoints",
      },
    ],
  },
  // Use absolute path that works in both local and Vercel
  apis: [
    path.resolve(__dirname, "../routes/**/*.js"),
    path.resolve(__dirname, "../routes/*.js"),
  ],
};

const specs = swaggerJsdoc(options);

// Log the generated spec for debugging
console.log(
  `📚 Swagger spec generated with ${Object.keys(specs.paths || {}).length} paths`,
);

const swaggerSetup = (app) => {
  // Add a route to serve the raw JSON spec for debugging
  app.get("/api-docs.json", (req, res) => {
    res.json(specs);
  });

  app.use(
    "/api-docs",
    swaggerUi.serve,
    swaggerUi.setup(specs, {
      explorer: true,
      customCss: ".swagger-ui .topbar { display: none }",
      customSiteTitle: "Nanos E-Commerce API Documentation",
      swaggerOptions: {
        persistAuthorization: true,
        displayRequestDuration: true,
      },
    }),
  );

  console.log(`📚 Swagger documentation available at /api-docs`);
  console.log(`📄 Swagger JSON spec available at /api-docs.json`);
};

module.exports = swaggerSetup;
