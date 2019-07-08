const VariantControllers = require("../controllers/variant-controllers");
const Joi = require("@hapi/joi");

const variantResponse = Joi.object()
  .keys({
    _id: Joi.object().optional(),
    key: Joi.string().optional(),
    acceptValues: Joi.array().items(Joi.string().optional()),
    type: Joi.string().optional(),
    label: Joi.string().optional()
  })
  .label("Result")
  .options({ allowUnknown: true });

const Router = {
  name: "variant-router",
  version: "1.0.0",
  register: async (server, options) => {
    server.route({
      method: "POST",
      path: "/variants",
      options: {
        validate: {
          payload: Joi.object()
            .keys({
              key: Joi.string().required(),
              acceptValues: Joi.array().items(Joi.string().required()),
              type: Joi.string().required(),
              label: Joi.string().optional()
            })
            .label("Body")
        },
        description: "Create new variant",
        tags: ["api", "variant"],
        response: { schema: variantResponse }
      },
      handler: VariantControllers.create
    });
  }
};

module.exports = Router;
