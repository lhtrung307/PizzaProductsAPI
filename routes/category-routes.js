const CategoryControllers = require("../controllers/category-controller");
const Joi = require("@hapi/joi");
const ValidateHandle = require("./validate-handle");

const Router = {
  name: "category-router",
  version: "1.0.0",
  register: async (server, options) => {
    server.route({
      method: "GET",
      path: "/categories",
      options: {
        response: ValidateHandle.responseOptions(
          ValidateHandle.categoryResponseSchema
        ),
        description: "Get list of categories",
        tags: ["api", "categories"]
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
          failAction: ValidateHandle.handleValidateError
        },
        description: "Create new categories",
        tags: ["api", "categories"],
        response: ValidateHandle.responseOptions(
          ValidateHandle.createdCategoryResponseSchema
        )
      },
      handler: CategoryControllers.create
    });
  }
};

module.exports = Router;
