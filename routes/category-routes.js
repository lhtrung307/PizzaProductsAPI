const CategoryControllers = require("../controllers/category-controller");
const Joi = require("@hapi/joi");

const categoryResponse = Joi.object()
  .keys({
    _id: Joi.string().optional(),
    name: Joi.string().optional(),
    description: Joi.string().optional()
  })
  .label("Result");

const Router = {
  name: "category-router",
  version: "1.0.0",
  register: async (server, options) => {
    server.route({
      method: "GET",
      path: "/categories",
      options: {
        validate: {
          failAction: (request, h, error) => {
            return error.isJoi
              ? h.response(error.details[0]).takeover()
              : h.response(error).takeover();
          }
        },
        description: "Get list of categories",
        tags: ["api", "order-pizza", "categories"],
        // response: {
        //   schema: categoryResponse
        // }
      },
      handler: CategoryControllers.list
    });
    server.route({
      method: "POST",
      path: "/categories",
      options: {
        validate: {
          payload: Joi.object()
            .keys({
              name: Joi.string().required(),
              description: Joi.string().required()
            })
            .label("Body"),
          failAction: (request, h, error) => {
            return error.isJoi
              ? h.response(error.details[0]).takeover()
              : h.response(error).takeover();
          }
        },
        description: "Create new categories",
        tags: ["api", "order-pizza", "categories"],
        response: { schema: categoryResponse }
      },
      handler: CategoryControllers.create
    });
  }
};

module.exports = Router;
