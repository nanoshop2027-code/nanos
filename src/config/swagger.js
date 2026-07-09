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
        CupCategory: {
          type: "object",
          properties: {
            _id: { type: "string" },
            name: { type: "string" },
            description: { type: "string" },
            image: { type: "string" },
            createdAt: { type: "string", format: "date-time" },
            updatedAt: { type: "string", format: "date-time" },
          },
        },
        Ingredient: {
          type: "object",
          properties: {
            _id: { type: "string" },
            type: {
              type: "string",
              enum: ["base", "chocolate_sauce", "nut", "extra"],
            },
            name: { type: "string" },
            image: { type: "string" },
            calories: { type: "number" },
            price: { type: "number" },
            createdAt: { type: "string", format: "date-time" },
            updatedAt: { type: "string", format: "date-time" },
          },
        },
        Cup: {
          type: "object",
          description:
            "A menu cup. originalPrice/discountPercentage/priceAfterDiscount/totalCalories are computed once and stored permanently.",
          properties: {
            _id: { type: "string" },
            name: { type: "string" },
            description: { type: "string" },
            image: { type: "string" },
            category: { type: "string", description: "CupCategory ID (or populated object)" },
            bases: { type: "array", items: { type: "string" } },
            chocolateSauces: { type: "array", items: { type: "string" } },
            nuts: { type: "array", items: { type: "string" } },
            extras: { type: "array", items: { type: "string" } },
            isManualPrice: { type: "boolean" },
            originalPrice: { type: "number" },
            discountPercentage: { type: "number" },
            priceAfterDiscount: { type: "number" },
            totalCalories: { type: "number" },
            createdAt: { type: "string", format: "date-time" },
            updatedAt: { type: "string", format: "date-time" },
          },
        },
        Order: {
          type: "object",
          description:
            "An immutable snapshot of purchased items, fees, and delivery info at the time of checkout.",
          properties: {
            _id: { type: "string" },
            orderNumber: { type: "string", example: "NNS-20260709-00001" },
            user: { type: "string" },
            items: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  itemType: { type: "string", enum: ["menu", "custom"] },
                  quantity: { type: "integer" },
                  name: { type: "string" },
                  description: { type: "string" },
                  image: { type: "string" },
                  categoryName: { type: "string" },
                  originalPrice: { type: "number" },
                  discountPercentage: { type: "number" },
                  finalPrice: { type: "number" },
                  totalCalories: { type: "number" },
                  lineTotal: { type: "number" },
                  ingredients: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        name: { type: "string" },
                        type: { type: "string" },
                        image: { type: "string" },
                        calories: { type: "number" },
                        price: { type: "number" },
                      },
                    },
                  },
                },
              },
            },
            deliveryInfo: {
              type: "object",
              properties: {
                fullName: { type: "string" },
                email: { type: "string" },
                phone: { type: "string" },
                address: { type: "string" },
                city: { type: "string" },
                postalCode: { type: "string" },
              },
            },
            paymentMethod: { type: "string", enum: ["cash", "card"] },
            fees: {
              type: "object",
              properties: {
                deliveryFee: {
                  type: "object",
                  properties: { enabled: { type: "boolean" }, amount: { type: "number" } },
                },
                packagingFee: {
                  type: "object",
                  properties: { enabled: { type: "boolean" }, amount: { type: "number" } },
                },
              },
            },
            itemsSubtotal: { type: "number" },
            totalAmount: { type: "number" },
            status: {
              type: "string",
              enum: ["pending", "preparing", "out_for_delivery", "delivered", "cancelled"],
            },
            createdAt: { type: "string", format: "date-time" },
            updatedAt: { type: "string", format: "date-time" },
          },
        },
        BusinessSettings: {
          type: "object",
          properties: {
            deliveryFee: {
              type: "object",
              properties: { enabled: { type: "boolean" }, amount: { type: "number" } },
            },
            packagingFee: {
              type: "object",
              properties: { enabled: { type: "boolean" }, amount: { type: "number" } },
            },
          },
        },
        CelebrationType: {
          type: "object",
          properties: {
            _id: { type: "string" },
            name: { type: "string", example: "Birthday" },
            image: { type: "string", nullable: true },
            createdAt: { type: "string", format: "date-time" },
            updatedAt: { type: "string", format: "date-time" },
          },
        },
        EventBooking: {
          type: "object",
          description:
            "A customer-submitted event booking request. The backend only stores the request; it does not send WhatsApp messages.",
          properties: {
            _id: { type: "string" },
            bookingNumber: { type: "string", example: "EVT-20260709-00001" },
            user: { type: "string", description: "User ID of the customer who submitted the booking" },
            celebrationType: {
              oneOf: [
                { type: "string" },
                { $ref: "#/components/schemas/CelebrationType" },
              ],
              description: "Celebration type ID (or populated object). Null when customCelebrationType is used.",
              nullable: true,
            },
            customCelebrationType: {
              type: "string",
              nullable: true,
              description: "Free-text celebration type provided when the customer selects \"Other\"",
            },
            eventDate: { type: "string", format: "date-time" },
            guestsRange: {
              type: "string",
              enum: ["50-100", "100-200", "200-500", "500+"],
            },
            customerInfo: {
              type: "object",
              properties: {
                fullName: { type: "string" },
                phone: { type: "string" },
                city: { type: "string" },
                notes: { type: "string", nullable: true, description: "Customer-submitted additional notes" },
              },
            },
            status: {
              type: "string",
              enum: ["pending", "contacted", "confirmed", "cancelled", "completed"],
              default: "pending",
            },
            actualNumberOfGuests: {
              type: "integer",
              nullable: true,
              description: "Set by the admin after communicating with the customer",
            },
            internalNotes: {
              type: "string",
              nullable: true,
              description: "Admin-only notes, separate from the customer's submitted notes",
            },
            createdAt: { type: "string", format: "date-time" },
            updatedAt: { type: "string", format: "date-time" },
          },
        },
        Pagination: {
          type: "object",
          properties: {
            currentPage: { type: "integer", example: 1 },
            totalPages: { type: "integer", example: 5 },
            totalItems: { type: "integer", example: 42 },
            limit: { type: "integer", example: 10 },
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
      {
        name: "Admin - Cup Categories",
        description: "Admin management of cup categories",
      },
      {
        name: "Customer - Cup Categories",
        description: "Browse cup categories",
      },
      {
        name: "Admin - Ingredients",
        description: "Admin management of cup ingredients (bases, chocolate sauces, nuts, extras)",
      },
      {
        name: "Customer - Ingredients",
        description: "Browse cup ingredients (bases, chocolate sauces, nuts, extras)",
      },
      {
        name: "Admin - Cups Menu",
        description: "Admin management of menu cups",
      },
      {
        name: "Customer - Cups Menu",
        description: "Browse, search, filter and sort menu cups",
      },
      {
        name: "Customer - Custom Cup",
        description: "Build and preview a custom cup",
      },
      {
        name: "Admin - Orders",
        description: "Admin order management",
      },
      {
        name: "Customer - Orders",
        description: "Checkout and order history",
      },
      {
        name: "Admin - Business Settings",
        description: "Admin management of delivery/packaging fee settings",
      },
      {
        name: "Customer - Business Settings",
        description: "Public business settings (delivery/packaging fees)",
      },
      {
        name: "Admin - Dashboard",
        description: "Admin dashboard statistics",
      },
      {
        name: "Admin - Celebration Types",
        description: "Admin management of event celebration types (Birthday, Wedding, etc.)",
      },
      {
        name: "Customer - Celebration Types",
        description: "Browse available event celebration types",
      },
      {
        name: "Admin - Event Bookings",
        description: "Admin management of event booking requests",
      },
      {
        name: "Customer - Event Bookings",
        description: "Submit and track event booking requests",
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
