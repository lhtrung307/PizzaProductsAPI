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
            .items(
              Joi.object().keys({
                productID: Joi.string().required(),
                variants: Joi.array()
              })
            )
            .label("Body"),
          failAction: (request, h, error) => {
            return error.isJoi
              ? h.response(error.details[0]).takeover()
              : h.response(error).takeover();
          }
        },
        description: "Get pizzas by pizza ids",
        tags: ["api", "order-pizza", "pizza"]
      },
      handler: ProductControllers.listByIDs
    });

    server.route({
      method: "GET",
      path: "/pizzas/category/{id}",
      options: {
        validate: {
          params: {
            id: Joi.string().required()
          },
          failAction: (request, h, error) => {
            return error.isJoi
              ? h.response(error.details[0]).takeover()
              : h.response(error).takeover();
          }
        },
        description: "Get pizzas by pizza ids",
        tags: ["api", "order-pizza", "pizzas"]
      },
      handler: ProductControllers.listByCategoryID
    });

    server.route({
      method: "GET",
      path: "/toppings",
      options: {
        description: "Get list of toppings",
        tags: ["api", "order-pizza", "toppings"]
      },
      handler: ProductControllers.listToppings
    });
  }
};

module.exports = Router;
