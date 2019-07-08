const Joi = require("joi");

const ProductControllers = require("../controllers/product-controller");
const ValidateHandle = require("./validate-handle");

const Router = {
  name: "product-router",
  version: "1.0.0",
  register: async (server, options) => {
    server.route({
      method: "GET",
      path: "/pizzas",
      options: {
        description: "Get list of products",
        tags: ["api", "pizza"],
        response: ValidateHandle.responseOptions(
          ValidateHandle.pizzaResponseSchema
        )
      },
      handler: ProductControllers.list
    });

    server.route({
      method: "GET",
      path: "/pizzas/{id}",
      options: {
        validate: {
          params: { id: Joi.string().length(24) },
          failAction: ValidateHandle.handleValidateError
        },
        description: "Get product detail by id",
        tags: ["api", "pizza"],
        response: ValidateHandle.responseOptions(
          ValidateHandle.pizzaDetailResponseSchema
        )
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
                  .items(
                    Joi.object().keys({
                      key: Joi.string().example("size"),
                      value: Joi.string().example("S")
                    })
                  )
                  .optional()
              })
            )
            .label("Body"),
          failAction: ValidateHandle.handleValidateError
        },
        description: "Get pizzas by pizza ids",
        tags: ["api", "pizza"],
        response: ValidateHandle.responseOptions(
          ValidateHandle.listPizzaResponseSchema
        )
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
          failAction: ValidateHandle.handleValidateError
        },
        description: "Get pizzas by category ids",
        tags: ["api", "pizza"],
        response: ValidateHandle.responseOptions(
          ValidateHandle.pizzaResponseSchema
        )
      },
      handler: ProductControllers.listByCategoryID
    });

    server.route({
      method: "GET",
      path: "/toppings",
      options: {
        description: "Get list of toppings",
        tags: ["api", "topping"],
        response: ValidateHandle.responseOptions(ValidateHandle.toppingResponse)
      },
      handler: ProductControllers.listToppings
    });

    server.route({
      method: "GET",
      path: "/best-sellers",
      options: {
        description: "Get list of best seller pizzas",
        tags: ["api", "pizza"],
        response: ValidateHandle.responseOptions(
          ValidateHandle.pizzaResponseSchema,
          { 200: Joi.string().example("Best seller is empty") }
        )
      },
      handler: ProductControllers.bestSellers
    });
  }
};

module.exports = Router;
