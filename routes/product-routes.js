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
    server.route({
      method: "POST",
      path: "/pizzas",
      options: {
        validate: {
          payload: Joi.array()
            .items(Joi.string().required())
            .label("Body"),
          failAction: (request, h, error) => {
            return error.isJoi
              ? h.response(error.details[0]).takeover()
              : h.response(error).takeover();
          }
        },
        description: "Get products by product ids",
        tags: ["api", "order-pizza", "product"]
      },
      handler: ProductControllers.listByIDs
    });
  }
};

module.exports = Router;
