const Joi = require("joi");

const ProductControllers = require("../controllers/product-controller");

const Router = {
  name: "product-router",
  version: "1.0.0",
  register: async (server, options) => {
    server.route({
      method: "GET",
      path: "/pizzas",
      options: {
        description: "Get list of products",
        tags: ["api", "order-pizza", "product"]
      },
      handler: ProductControllers.list
    });
    server.route({
      method: "GET",
      path: "/pizzas/{id}",
      options: {
        description: "Get product detail by id",
        tags: ["api", "order-pizza", "product"]
      },
      handler: ProductControllers.detail
    });
  }
};

module.exports = Router;
